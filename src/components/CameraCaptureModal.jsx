import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  X,
  RefreshCw,
  Zap,
  Check,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  Pill,
  TrendingDown,
  FileText,
  ScanLine,
  Info,
  HelpCircle
} from 'lucide-react';
import { analyzeImageWithAI } from '../services/imageAnalysisService';
import { saveCameraCaptureBackend } from '../services/api';

export function CameraCaptureModal({
  isOpen,
  onClose,
  onConfirmPhoto
}) {
  const [stream, setStream] = useState(null);
  const [isUsingWebcam, setIsUsingWebcam] = useState(false);
  const [webcamError, setWebcamError] = useState(null);
  const [flashOn, setFlashOn] = useState(false);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (traseira) ou 'user' (frontal)
  const [shutterFlashing, setShutterFlashing] = useState(false);

  // Imagem capturada (ou selecionada)
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedName, setCapturedName] = useState('');
  const [selectedIntent, setSelectedIntent] = useState('generic'); // 'generic' | 'repurchase' | 'prescription'

  // Análise com IA & OCR
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Presets de simulação para teste farmacêutico rápido e acessível
  const [selectedPreset, setSelectedPreset] = useState('dorflex');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const mockPresets = {
    dorflex: {
      name: 'foto_medicamento_dorflex.jpg',
      title: 'Dorflex MAX 4 Comprimidos',
      sub: 'Sanofi • Dipirona + Orfenadrina + Cafeína',
      url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80',
      defaultIntent: 'generic'
    },
    dipirona: {
      name: 'foto_dipirona_500mg.jpg',
      title: 'Dipirona 500mg 10 Comprimidos',
      sub: 'EMS Genéricos • Analgésico e Antitérmico',
      url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      defaultIntent: 'generic'
    },
    receita: {
      name: 'foto_receita_medica.jpg',
      title: 'Receita Médica Prescrição Digital',
      sub: 'Dr. Marcelo Santos CRM/SP • Amoxicilina + Dipirona',
      url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
      defaultIntent: 'prescription'
    },
    objeto_comum: {
      name: 'foto_objeto_sem_remedio.jpg',
      title: 'Foto Sem Remédio (Teste de Rejeição)',
      sub: 'Ambiente ou objeto sem texto farmacêutico',
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
      defaultIntent: 'generic'
    }
  };

  // Iniciar / Parar webcam real do dispositivo
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      resetState();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  // Vincular stream de vídeo ao elemento <video> de forma reativa
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((err) => {
        console.warn('Vídeo da câmera não pôde iniciar reprodução automática:', err);
      });
    }
  }, [stream, isUsingWebcam, capturedImage]);

  const resetState = () => {
    setCapturedImage(null);
    setCapturedName('');
    setIsAnalyzing(false);
    setAnalysisProgress(0);
    setAnalysisResult(null);
  };

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
        setStream(mediaStream);
        setIsUsingWebcam(true);
        setWebcamError(null);
      } else {
        setIsUsingWebcam(false);
        setWebcamError('API de câmera não suportada neste navegador.');
      }
    } catch (err) {
      console.warn('Câmera nativa não disponível ou permissão recusada. Ativando simulador de scanner de farmácia.', err);
      setIsUsingWebcam(false);
      setWebcamError('Câmera física não detectada ou permissão pendente. Use a galeria ou os exemplos de medicamentos.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsUsingWebcam(false);
  };

  const handleToggleFacingMode = () => {
    stopCamera();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Disparo do Obturador (Shutter)
  const handleTriggerShutter = async () => {
    // Efeito visual de flash branco
    setShutterFlashing(true);
    setTimeout(() => setShutterFlashing(false), 220);

    let dataUrl = '';
    let fileName = '';

    if (isUsingWebcam && videoRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      fileName = `foto_camera_${Date.now()}.jpg`;
    } else {
      // Usa preset simulado selecionado
      const preset = mockPresets[selectedPreset];
      dataUrl = preset.url;
      fileName = preset.name;
    }

    setCapturedImage(dataUrl);
    setCapturedName(fileName);

    // Iniciar Análise Estrita de Visão Computacional com IA Sofia
    await processImageWithAI(dataUrl, fileName);
  };

  // Processar Imagem Selecionada de Arquivo da Galeria
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result;
        setCapturedImage(dataUrl);
        setCapturedName(file.name);
        await processImageWithAI(dataUrl, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // Pipeline Inteligente de OCR e Visão Farmacêutica
  const processImageWithAI = async (imageSrc, fileName) => {
    setIsAnalyzing(true);
    setAnalysisProgress(15);

    try {
      const result = await analyzeImageWithAI(imageSrc, fileName, (pct) => {
        setAnalysisProgress(Math.max(15, pct));
      });

      setAnalysisResult(result);
      if (result.identified) {
        setSelectedIntent(result.intent || 'generic');
      }
    } catch (err) {
      console.error('Erro na análise da imagem pela IA:', err);
      setAnalysisResult({
        success: false,
        identified: false,
        title: 'Não foi possível ler a imagem',
        message: 'A foto não pôde ser processada. Por favor, tire outra foto com melhor iluminação e foco.',
        reason: 'A imagem estava borrada ou sem iluminação adequada para leitura óptica.',
        suggestions: [
          'Aproxime a câmera da embalagem do medicamento.',
          'Certifique-se de que o texto do remédio ou princípio ativo esteja nítido.',
          'Evite reflexos diretos de lâmpadas ou flash na caixa.'
        ]
      });
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(100);
    }
  };

  // Confirmar e enviar para a consulta da IA (APENAS se identificado)
  const handleConfirm = async () => {
    if (!capturedImage || !analysisResult || !analysisResult.identified) return;

    const payload = {
      type: (analysisResult.intent === 'prescription' || selectedIntent === 'prescription') ? 'prescription' : 'photo',
      name: capturedName || `${analysisResult.detectedMedication}.jpg`,
      previewUrl: capturedImage,
      intent: selectedIntent,
      detectedMedication: analysisResult.detectedMedication,
      analysisResult: analysisResult,
      rawText: analysisResult.rawText || ''
    };

    // Armazena automaticamente os dados e imagem da câmera no backend FastAPI
    try {
      await saveCameraCaptureBackend({ photoData: payload });
    } catch (saveErr) {
      console.warn('Erro ao armazenar imagem da câmera no backend:', saveErr);
    }

    onConfirmPhoto(payload);
    onClose();
  };

  if (!isOpen) return null;

  const isIdentified = Boolean(analysisResult && analysisResult.identified);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.88)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.75rem',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      {/* Canvas oculto para tirar snapshot do stream */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div style={{
        width: '100%',
        maxWidth: '460px',
        backgroundColor: '#090D16',
        borderRadius: '28px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        border: '1.5px solid rgba(255, 255, 255, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        maxHeight: '94vh'
      }}>

        {/* Efeito Flash Branco de Disparo */}
        {shutterFlashing && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#FFFFFF',
            zIndex: 999,
            pointerEvents: 'none'
          }} />
        )}

        {/* Topo do Viewfinder / Câmera */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.85rem 1.15rem',
          backgroundColor: '#090D16',
          color: '#FFFFFF',
          zIndex: 10,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              backgroundColor: isUsingWebcam ? '#22C55E' : '#EAB308',
              boxShadow: isUsingWebcam ? '0 0 10px #22C55E' : '0 0 8px #EAB308'
            }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 800, letterSpacing: '-0.2px' }}>
                {isUsingWebcam ? 'Câmera ao Vivo Pague Menos' : 'Scanner Farmacêutico IA'}
              </span>
              <span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>
                {isUsingWebcam ? 'Webcam ativa com leitura de embalagens' : 'Modo demonstração com IA Sofia ativa'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={() => setFlashOn(!flashOn)}
              style={{
                backgroundColor: flashOn ? '#FDE047' : 'rgba(255, 255, 255, 0.12)',
                color: flashOn ? '#0F172A' : '#FFFFFF',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: 'none'
              }}
              title="Iluminação / Flash"
            >
              <Zap size={15} />
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: 'none'
              }}
              title="Fechar Câmera"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* ================================================================
            ESTADO A: VISOR AO VIVO (Capturando foto)
            ================================================================ */}
        {!capturedImage ? (
          <div style={{
            position: 'relative',
            width: '100%',
            height: '380px',
            backgroundColor: '#000000',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Stream Real de Vídeo se houver webcam */}
            {isUsingWebcam ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: flashOn ? 'brightness(1.25) contrast(1.1)' : 'none'
                }}
              />
            ) : (
              /* Fundo de Simulação do Produto com Selector de Amostras */
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <img
                  src={mockPresets[selectedPreset].url}
                  alt={mockPresets[selectedPreset].title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: flashOn ? 'brightness(1.2) contrast(1.05)' : 'brightness(0.92)'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(9, 13, 22, 0.85)',
                  backdropFilter: 'blur(8px)',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800 }}>
                      {mockPresets[selectedPreset].title}
                    </div>
                    <span style={{ fontSize: '0.65rem', backgroundColor: '#001FD8', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
                      Exemplo
                    </span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#CBD5E1', marginTop: '0.15rem' }}>
                    {mockPresets[selectedPreset].sub}
                  </div>
                </div>
              </div>
            )}

            {/* Linha de Scanner Animada */}
            <div style={{
              position: 'absolute',
              top: '18%',
              left: '10%',
              right: '10%',
              height: '2px',
              backgroundColor: '#4ADE80',
              boxShadow: '0 0 12px 2px #4ADE80',
              animation: 'scanLine 2.4s ease-in-out infinite'
            }} />

            {/* Guia de Enquadramento Farmacêutico */}
            <div style={{
              position: 'absolute',
              top: '10%',
              left: '8%',
              right: '8%',
              bottom: '14%',
              border: '2px dashed rgba(255, 255, 255, 0.55)',
              borderRadius: '20px',
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '0.85rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '20px', height: '20px', borderTop: '3px solid #001FD8', borderLeft: '3px solid #001FD8' }} />
                <div style={{ width: '20px', height: '20px', borderTop: '3px solid #001FD8', borderRight: '3px solid #001FD8' }} />
              </div>

              <div style={{ textAlign: 'center' }}>
                <span style={{
                  backgroundColor: 'rgba(0, 31, 216, 0.9)',
                  color: '#FFFFFF',
                  padding: '0.3rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  letterSpacing: '0.2px',
                  boxShadow: '0 4px 12px rgba(0, 31, 216, 0.4)'
                }}>
                  Enquadre a caixa, cartela ou receita aqui
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '20px', height: '20px', borderBottom: '3px solid #001FD8', borderLeft: '3px solid #001FD8' }} />
                <div style={{ width: '20px', height: '20px', borderBottom: '3px solid #001FD8', borderRight: '3px solid #001FD8' }} />
              </div>
            </div>

            {/* Banner Informativo se câmera física não estiver disponível */}
            {webcamError && (
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                right: '12px',
                backgroundColor: 'rgba(234, 179, 8, 0.95)',
                color: '#0F172A',
                padding: '0.45rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.68rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                zIndex: 20
              }}>
                <Info size={14} flexShrink={0} />
                <span>Simulador de scanner pronto para testes. Você também pode enviar fotos reais da sua máquina!</span>
              </div>
            )}
          </div>
        ) : (
          /* ================================================================
              ESTADO B: REVISÃO DA FOTO COM ANÁLISE DE IA E OCR
              ================================================================ */
          <div style={{
            padding: '1.25rem',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxHeight: '620px',
            overflowY: 'auto'
          }}>

            {/* Foto Capturada + Status da Análise */}
            <div style={{
              display: 'flex',
              gap: '0.85rem',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              padding: '0.75rem',
              borderRadius: '16px',
              border: isIdentified ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                width: '84px',
                height: '84px',
                borderRadius: '14px',
                overflow: 'hidden',
                border: isIdentified ? '2px solid #10B981' : (analysisResult && !isIdentified ? '2px solid #EF4444' : '2px solid #001FD8'),
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                position: 'relative'
              }}>
                <img
                  src={capturedImage}
                  alt="Foto capturada"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {isAnalyzing && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 31, 216, 0.65)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Loader2 size={24} className="animate-spin" color="#FFFFFF" />
                  </div>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: isAnalyzing ? '#3B82F6' : (isIdentified ? '#10B981' : '#EF4444'),
                  color: '#FFFFFF',
                  padding: '0.15rem 0.55rem',
                  borderRadius: '6px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  marginBottom: '0.35rem'
                }}>
                  {isAnalyzing ? (
                    <>
                      <Loader2 size={11} className="animate-spin" />
                      <span>Sofia IA analisando imagem ({analysisProgress}%)...</span>
                    </>
                  ) : isIdentified ? (
                    <>
                      <Check size={11} strokeWidth={3} />
                      <span>Medicamento identificado com sucesso</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={11} strokeWidth={3} />
                      <span>Não identificado na farmácia</span>
                    </>
                  )}
                </div>

                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {isIdentified
                    ? analysisResult.detectedMedication
                    : (isAnalyzing ? 'Analisando imagem...' : 'Produto não reconhecido')}
                </div>

                <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '0.15rem' }}>
                  {isIdentified
                    ? `${analysisResult.brand} • ${analysisResult.category}`
                    : (isAnalyzing ? 'Lendo caracteres e cruzando com catálogo farmacêutico' : 'Tire outra foto posicionando a embalagem')}
                </div>
              </div>
            </div>

            {/* SE ESTIVER ANALISANDO: BARRA DE PROGRESSO COM PASSOS */}
            {isAnalyzing && (
              <div style={{
                backgroundColor: 'rgba(0, 31, 216, 0.15)',
                border: '1.5px solid rgba(0, 31, 216, 0.4)',
                borderRadius: '16px',
                padding: '1.15rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#60A5FA', fontSize: '0.82rem', fontWeight: 800 }}>
                    <Sparkles size={16} />
                    <span>Processando Visão Computacional</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FFFFFF' }}>{analysisProgress}%</span>
                </div>

                <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${analysisProgress}%`,
                    height: '100%',
                    backgroundColor: '#001FD8',
                    transition: 'width 0.3s ease'
                  }} />
                </div>

                <div style={{ fontSize: '0.72rem', color: '#CBD5E1', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div>• Lendo caracteres ópticos da caixa / receita com OCR...</div>
                  <div>• Verificando se corresponde a medicamentos ou receitas médicas...</div>
                  <div>• Buscando genéricos equivalentes e economia na Pague Menos...</div>
                </div>
              </div>
            )}

            {/* CASO NÃO SEJA MEDICAMENTO / NÃO IDENTIFICADO: MENSAGEM CLARA PEDINDO NOVA FOTO */}
            {!isAnalyzing && analysisResult && !isIdentified && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1.5px solid rgba(239, 68, 68, 0.45)',
                borderRadius: '18px',
                padding: '1.15rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <AlertTriangle size={20} color="#FFFFFF" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#FCA5A5' }}>
                      Não foi possível identificar o medicamento
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#F87171' }}>
                      A Sofia IA não encontrou nenhuma caixa, cartela ou receita médica legível
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  padding: '0.75rem 0.95rem',
                  borderRadius: '12px',
                  fontSize: '0.74rem',
                  color: '#E2E8F0',
                  lineHeight: 1.45,
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  {analysisResult.reason || 'Por favor, tire outra foto focando na embalagem ou nos nomes impressos na caixa do remédio.'}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Como tirar uma foto que a IA consiga ler:
                  </div>
                  {(analysisResult.suggestions || [
                    'Aproxime a câmera da embalagem para focar no nome do remédio ou na dosagem (mg).',
                    'Garanta boa iluminação e evite reflexos ou dedos cobrindo as letras.',
                    'Se for uma receita médica, certifique-se de que o CRM e os itens receitados estejam legíveis.'
                  ]).map((sug, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '0.72rem', color: '#CBD5E1' }}>
                      <span style={{ color: '#EF4444', fontWeight: 800 }}>•</span>
                      <span>{sug}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CASO SEJA IDENTIFICADO COM SUCESSO: INFORMAÇÕES EXTRAÍDAS PELA IA */}
            {!isAnalyzing && isIdentified && (
              <div style={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1.5px solid #1E293B',
                borderRadius: '18px',
                padding: '1.15rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#10B981', fontSize: '0.82rem', fontWeight: 800 }}>
                    <Sparkles size={16} />
                    <span>Inteligência Farmacêutica Extraída</span>
                  </div>
                  <span style={{
                    fontSize: '0.64rem',
                    fontWeight: 800,
                    backgroundColor: analysisResult.requiresPrescription ? '#E30613' : '#001FD8',
                    color: '#FFFFFF',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px'
                  }}>
                    {analysisResult.requiresPrescription ? 'Receita Obrigatória' : 'Venda Livre (MIP)'}
                  </span>
                </div>

                {/* Detalhes Clínicos */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: '0.65rem', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>Princípio Ativo & Dosagem</div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.15rem' }}>
                      {analysisResult.activePrinciple}
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: '0.65rem', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>Registro ANVISA</div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38BDF8', marginTop: '0.15rem' }}>
                      {analysisResult.anvisaRegistry}
                    </div>
                  </div>
                </div>

                {/* Comparativo de Economia com Genérico */}
                {analysisResult.equivalentGeneric && (
                  <div style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    border: '1.5px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    padding: '0.75rem 0.85rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34D399', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <TrendingDown size={14} />
                        Economia Inteligente com Genérico: -{analysisResult.savingsPct}%
                      </span>
                      <span style={{ fontSize: '0.84rem', fontWeight: 900, color: '#FFFFFF' }}>
                        R$ {analysisResult.genericPrice?.toFixed(2)}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#CBD5E1', marginTop: '0.25rem' }}>
                      {analysisResult.equivalentGeneric} (mesma eficácia comprovada que a referência de R$ {analysisResult.referencePrice?.toFixed(2)}).
                    </div>
                  </div>
                )}

                {/* Orientação Farmacêutica */}
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.65rem' }}>
                  <strong style={{ color: '#E2E8F0' }}>Orientação: </strong>
                  {analysisResult.usageAdvice}
                </div>
              </div>
            )}

            {/* SELETOR DE INTENÇÃO (APENAS SE IDENTIFICADO) */}
            {!isAnalyzing && isIdentified && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#CBD5E1', marginLeft: '0.25rem' }}>
                  O que você deseja fazer com esta foto?
                </div>

                {[
                  {
                    id: 'generic',
                    title: 'Comprar o Genérico Equivalente',
                    desc: 'A mesma fórmula aprovada pela ANVISA por um preço muito mais acessível.',
                    badge: 'Mais Econômico',
                    badgeColor: '#10B981'
                  },
                  {
                    id: 'repurchase',
                    title: 'Comprar este mesmo medicamento',
                    desc: 'Levar exatamente o produto da foto com descontos exclusivos Sempre Bem.',
                    badge: 'Recompra',
                    badgeColor: '#001FD8'
                  },
                  {
                    id: 'prescription',
                    title: 'É uma Receita Médica Digital',
                    desc: 'Validar prescrição oficial (CRM) para liberar compra de controlados.',
                    badge: 'ANVISA / CFM',
                    badgeColor: '#E30613'
                  }
                ].map((opt) => {
                  const isSelected = selectedIntent === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedIntent(opt.id)}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: '12px',
                        backgroundColor: isSelected ? 'rgba(0, 31, 216, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                        border: isSelected ? '1.5px solid #001FD8' : '1px solid rgba(255, 255, 255, 0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFFFFF' }}>
                            {opt.title}
                          </span>
                          <span style={{
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            backgroundColor: opt.badgeColor,
                            color: '#FFFFFF',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px'
                          }}>
                            {opt.badge}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.15rem' }}>
                          {opt.desc}
                        </div>
                      </div>

                      <div style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: isSelected ? '5px solid #001FD8' : '2px solid #64748B',
                        backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
                        flexShrink: 0,
                        marginLeft: '0.5rem'
                      }} />
                    </div>
                  );
                })}
              </div>
            )}

            {/* BOTÕES DE AÇÃO NA REVISÃO */}
            <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.35rem' }}>
              {/* Botão de Tirar Outra Foto (sempre disponível) */}
              <button
                type="button"
                onClick={() => {
                  resetState();
                  startCamera();
                }}
                disabled={isAnalyzing}
                style={{
                  flex: isIdentified ? 1 : 1,
                  padding: '0.85rem',
                  borderRadius: '12px',
                  backgroundColor: !isIdentified ? '#001FD8' : 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                  border: 'none',
                  opacity: isAnalyzing ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: !isIdentified ? '0 4px 14px rgba(0, 31, 216, 0.35)' : 'none'
                }}
              >
                <RefreshCw size={17} />
                <span>{!isIdentified ? 'Tirar outra foto do medicamento' : 'Tirar outra foto'}</span>
              </button>

              {/* Botão de Confirmar (APENAS se o medicamento for realmente identificado) */}
              {isIdentified && (
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isAnalyzing}
                  style={{
                    flex: 2,
                    padding: '0.85rem',
                    borderRadius: '12px',
                    backgroundColor: '#E30613',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 4px 14px rgba(227, 6, 19, 0.4)',
                    cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                    border: 'none',
                    opacity: isAnalyzing ? 0.5 : 1
                  }}
                >
                  <Check size={16} />
                  <span>Confirmar e Montar Cesta com IA</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================================================================
            RODAPÉ DOS CONTROLES DO OBTURADOR (quando ainda não capturou)
            ================================================================ */}
        {!capturedImage && (
          <div style={{
            padding: '1rem 1.25rem 1.25rem 1.25rem',
            backgroundColor: '#090D16',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>

            {/* SELEÇÃO RÁPIDA DE AMOSTRAS FARMACÊUTICAS SE ESTIVER SEM WEBCAM */}
            {!isUsingWebcam && (
              <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
                {Object.entries(mockPresets).map(([key, item]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedPreset(key)}
                    style={{
                      padding: '0.3rem 0.65rem',
                      borderRadius: '8px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      backgroundColor: selectedPreset === key ? '#001FD8' : 'rgba(255, 255, 255, 0.08)',
                      color: '#FFFFFF',
                      border: selectedPreset === key ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer'
                    }}
                  >
                    {item.title.split(' ')[0]}
                  </button>
                ))}
              </div>
            )}

            {/* Linha com Botão de Disparo Principal */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.5rem' }}>
              {/* Botão de Galeria de Fotos */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
                title="Carregar foto da galeria do computador ou celular"
              >
                <ImageIcon size={20} />
              </button>

              {/* Botão de Disparo Obturador Estilo iPhone */}
              <button
                type="button"
                onClick={handleTriggerShutter}
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  border: '4px solid #FFFFFF',
                  padding: '3px',
                  backgroundColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.1s ease',
                  boxShadow: '0 0 18px rgba(255, 255, 255, 0.35)'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                title="Fotografar agora"
              >
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF'
                }} />
              </button>

              {/* Inverter Câmera (Frontal / Traseira) ou Reabrir Câmera */}
              <button
                type="button"
                onClick={isUsingWebcam ? handleToggleFacingMode : startCamera}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
                title={isUsingWebcam ? 'Girar câmera (frontal / traseira)' : 'Tentar ativar câmera real'}
              >
                <RefreshCw size={18} />
              </button>
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.68rem', color: '#94A3B8' }}>
              Toque no botão central branco para fotografar o medicamento ou receita
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
