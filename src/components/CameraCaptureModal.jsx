import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Zap, Check, Image, FileText, Sparkles, AlertCircle } from 'lucide-react';

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

  // Presets de simulação para teste rápido e acessível
  const [selectedPreset, setSelectedPreset] = useState('dorflex');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result);
        setCapturedName(file.name);
        setSelectedIntent(file.name.toLowerCase().includes('receita') ? 'prescription' : 'generic');
      };
      reader.readAsDataURL(file);
    }
  };

  const mockPresets = {
    dorflex: {
      name: 'foto_medicamento_dorflex.jpg',
      title: 'Dorflex 36 Comprimidos',
      sub: 'Sanofi Aventis • Analgésico e Relaxante Muscular',
      url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80',
      defaultIntent: 'generic'
    },
    rivotril: {
      name: 'foto_remedio_rivotril_2mg.jpg',
      title: 'Rivotril 2mg 30 Comprimidos',
      sub: 'Roche • Clonazepam Referência',
      url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      defaultIntent: 'generic'
    },
    receita: {
      name: 'foto_receita_medica.jpg',
      title: 'Receita Médica Prescrição Digital',
      sub: 'Dr. Marcelo Santos CRM/SP • Amoxicilina + Dipirona',
      url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
      defaultIntent: 'prescription'
    }
  };

  // Iniciar / Parar webcam real do dispositivo
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedImage(null);
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

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
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } else {
        setIsUsingWebcam(false);
      }
    } catch (err) {
      console.warn('Câmera nativa não disponível ou permissão recusada. Usando simulador de scanner de farmácia.', err);
      setIsUsingWebcam(false);
      setWebcamError('Modo simulador ativo (câmera real sem permissão ou não detectada)');
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
  const handleTriggerShutter = () => {
    // Efeito visual de flash branco
    setShutterFlashing(true);
    setTimeout(() => setShutterFlashing(false), 220);

    if (isUsingWebcam && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(dataUrl);
      setCapturedName(`foto_camera_${Date.now()}.jpg`);
      setSelectedIntent('generic');
    } else {
      // Usa preset simulado selecionado
      const preset = mockPresets[selectedPreset];
      setCapturedImage(preset.url);
      setCapturedName(preset.name);
      setSelectedIntent(preset.defaultIntent);
    }
  };

  // Confirmar e enviar para a consulta da IA
  const handleConfirm = () => {
    if (!capturedImage) return;

    onConfirmPhoto({
      type: selectedIntent === 'prescription' ? 'prescription' : 'photo',
      name: capturedName || 'foto_medicamento.jpg',
      previewUrl: capturedImage,
      intent: selectedIntent,
      detectedMedication: selectedPreset === 'dorflex' ? 'Dorflex' : (selectedPreset === 'rivotril' ? 'Rivotril' : 'Receita Médica')
    });

    onClose();
  };

  if (!isOpen) return null;

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
        maxWidth: '430px',
        backgroundColor: '#090D16',
        borderRadius: '28px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        border: '1.5px solid rgba(255, 255, 255, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        maxHeight: '92vh'
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
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isUsingWebcam ? '#22C55E' : '#EAB308',
              boxShadow: isUsingWebcam ? '0 0 8px #22C55E' : 'none'
            }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, letterSpacing: '-0.2px' }}>
              {isUsingWebcam ? 'Câmera do Dispositivo' : 'Scanner de Medicamentos FarmaViva'}
            </span>
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
                cursor: 'pointer'
              }}
              title="Alternar Flash"
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
                cursor: 'pointer'
              }}
              title="Fechar Câmera"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Corpo: Visor da Câmera (AO VIVO ou MOCK REVIEW) */}
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
                  objectFit: 'cover'
                }}
              />
            ) : (
              /* Fundo de Simulação do Produto */
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <img
                  src={mockPresets[selectedPreset].url}
                  alt={mockPresets[selectedPreset].title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.92)'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(6px)',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '10px',
                  color: '#FFFFFF'
                }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800 }}>
                    {mockPresets[selectedPreset].title}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#CBD5E1' }}>
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
              top: '12%',
              left: '8%',
              right: '8%',
              bottom: '16%',
              border: '2px dashed rgba(255, 255, 255, 0.55)',
              borderRadius: '18px',
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '0.75rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '16px', height: '16px', borderTop: '3px solid #001FD8', borderLeft: '3px solid #001FD8' }} />
                <div style={{ width: '16px', height: '16px', borderTop: '3px solid #001FD8', borderRight: '3px solid #001FD8' }} />
              </div>

              <div style={{ textAlign: 'center' }}>
                <span style={{
                  backgroundColor: 'rgba(0, 31, 216, 0.85)',
                  color: '#FFFFFF',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  letterSpacing: '0.2px'
                }}>
                  Posicione a embalagem ou receita aqui
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '16px', height: '16px', borderBottom: '3px solid #001FD8', borderLeft: '3px solid #001FD8' }} />
                <div style={{ width: '16px', height: '16px', borderBottom: '3px solid #001FD8', borderRight: '3px solid #001FD8' }} />
              </div>
            </div>
          </div>
        ) : (
          /* TELA DE REVISÃO E ESCOLHA DE OBJETIVO DA FOTO CAPTURADA */
          <div style={{
            padding: '1.25rem',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
              <div style={{
                width: '84px',
                height: '84px',
                borderRadius: '14px',
                overflow: 'hidden',
                border: '2px solid #001FD8',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0, 31, 216, 0.3)'
              }}>
                <img
                  src={capturedImage}
                  alt="Foto capturada"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#10B981', color: '#FFFFFF', padding: '0.15rem 0.55rem', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                  <Check size={11} strokeWidth={3} />
                  <span>Foto capturada com nitidez</span>
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {capturedName}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  Escolha o que você quer resolver com esta foto:
                </div>
              </div>
            </div>

            {/* SELETOR DE INTENÇÃO / AÇÃO FARMACÊUTICA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                {
                  id: 'generic',
                  title: 'Ver o Genérico Equivalente',
                  desc: 'Encontrar a mesma fórmula aprovada pela ANVISA por até metade do preço.',
                  badge: 'Mais Econômico',
                  badgeColor: '#10B981'
                },
                {
                  id: 'repurchase',
                  title: 'Comprar este mesmo medicamento',
                  desc: 'Recomprar exatamente o produto da foto com descontos do Clube FarmaViva.',
                  badge: 'Recompra',
                  badgeColor: '#001FD8'
                },
                {
                  id: 'prescription',
                  title: 'É uma Receita Médica',
                  desc: 'Validar prescrição oficial (CRM) para liberar compra de medicamentos controlados.',
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

            {/* Botões de Ação na Revisão */}
            <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.35rem' }}>
              <button
                type="button"
                onClick={() => setCapturedImage(null)}
                style={{
                  flex: 1,
                  padding: '0.65rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Tirar outra foto
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                style={{
                  flex: 2,
                  padding: '0.65rem',
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
                  cursor: 'pointer'
                }}
              >
                <Check size={16} />
                <span>Confirmar e Anexar</span>
              </button>
            </div>
          </div>
        )}

        {/* Rodapé dos Controles do Obturador (quando ainda não capturou) */}
        {!capturedImage && (
          <div style={{
            padding: '1rem 1.25rem 1.25rem 1.25rem',
            backgroundColor: '#090D16',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}>
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
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
                title="Carregar foto da galeria"
              >
                <Image size={20} />
              </button>

              {/* Botão de Disparo Obturador Estilo iPhone */}
              <button
                type="button"
                onClick={handleTriggerShutter}
                style={{
                  width: '66px',
                  height: '66px',
                  borderRadius: '50%',
                  border: '4px solid #FFFFFF',
                  padding: '3px',
                  backgroundColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.1s ease',
                  boxShadow: '0 0 16px rgba(255, 255, 255, 0.3)'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                title="Tirar foto"
              >
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF'
                }} />
              </button>

              {/* Inverter Câmera (Frontal / Traseira) */}
              <button
                type="button"
                onClick={handleToggleFacingMode}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Girar câmera"
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
