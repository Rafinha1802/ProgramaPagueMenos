import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Paperclip,
  Camera,
  X,
  Maximize2,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Check,
  ChevronRight,
  FileText,
  ArrowRight,
  MessageSquare,
  AlertTriangle,
  Plus,
  Minus
} from 'lucide-react';
import { runAiCommerceEngine, runAiCommerceEngineAsync } from '../services/aiCommerceEngine.js';
import { FormattedChatMessage } from './FormattedChatMessage.jsx';

export function ChatbotWidget({
  isOpen,
  onToggle,
  onClose,
  onAddToCart,
  onAddBatchToCart,
  cartItems = [],
  cartItemsCount = 0,
  cartTotal = 0,
  onOpenCart,
  onNavigateToFullPage,
  onOpenCamera,
  onShowToast,
  userSession,
  isMobile = false
}) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      time: 'Agora',
      text: 'Olá! Sou a **Dra. Sofia**, sua Farmacêutica Virtual da Pague Menos. 👩‍⚕️💊\n\nComo posso cuidar de você hoje? Você pode me descrever sintomas (ex: *dor de cabeça*, *azia*), pedir produtos mais econômicos, solicitar genéricos ou anexar sua receita médica!',
      products: [],
      safetyNotice: null
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isBubbleOpen, setIsBubbleOpen] = useState(true);
  const [bubbleTextIndex, setBubbleTextIndex] = useState(0);

  // Estado de seleção e quantidade de produtos em cada mensagem do chat
  // Formato: { [msgId]: { [productId]: { selected: boolean, quantity: number } } }
  const [itemSelections, setItemSelections] = useState({});

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const bubbleMessages = [
    "Olá! Posso te ajudar a montar sua cesta ou encontrar genéricos?",
    "Precisa de protetor para a praia ou alívio de gripe e dor?",
    "Economize até 95% trocando por genéricos aprovados pela ANVISA!",
    "Envie sua dúvida ou receita médica para nossa Farmacêutica IA."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setBubbleTextIndex((prev) => (prev + 1) % bubbleMessages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [bubbleMessages.length]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  // Funções de Seleção de Produtos no Chat
  const getSelection = (msgId, prodId) => {
    return itemSelections[msgId]?.[prodId] || { selected: true, quantity: 1 };
  };

  const toggleSelect = (msgId, prodId) => {
    setItemSelections((prev) => {
      const current = prev[msgId]?.[prodId] || { selected: true, quantity: 1 };
      return {
        ...prev,
        [msgId]: {
          ...(prev[msgId] || {}),
          [prodId]: { ...current, selected: !current.selected }
        }
      };
    });
  };

  const updateQuantity = (msgId, prodId, delta) => {
    setItemSelections((prev) => {
      const current = prev[msgId]?.[prodId] || { selected: true, quantity: 1 };
      const newQty = Math.max(1, Math.min(10, current.quantity + delta));
      return {
        ...prev,
        [msgId]: {
          ...(prev[msgId] || {}),
          [prodId]: { ...current, quantity: newQty }
        }
      };
    });
  };

  const toggleSelectAll = (msgId, products) => {
    const allSelected = products.every((p) => getSelection(msgId, p.id).selected);
    setItemSelections((prev) => {
      const updatedMsg = { ...(prev[msgId] || {}) };
      products.forEach((p) => {
        const current = updatedMsg[p.id] || { selected: true, quantity: 1 };
        updatedMsg[p.id] = { ...current, selected: !allSelected };
      });
      return { ...prev, [msgId]: updatedMsg };
    });
  };

  const getSelectedProducts = (msgId, products) => {
    return products
      .filter((p) => getSelection(msgId, p.id).selected)
      .map((p) => ({ product: p, quantity: getSelection(msgId, p.id).quantity }));
  };

  const handleBuySelected = (msgId, products) => {
    const selected = getSelectedProducts(msgId, products);
    if (selected.length === 0) {
      if (onShowToast) onShowToast('Selecione ao menos 1 produto para comprar!');
      return;
    }
    if (onAddBatchToCart) {
      onAddBatchToCart(selected);
    } else if (onAddToCart) {
      selected.forEach((s) => {
        for (let i = 0; i < s.quantity; i++) {
          onAddToCart(s.product);
        }
      });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachment({
          type: file.type.includes('image') ? 'photo' : 'document',
          name: file.name,
          previewUrl: file.type.includes('image') ? event.target.result : null,
          intent: 'generic'
        });
        if (onShowToast) onShowToast(`Anexo adicionado: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const processAndSendMessage = (textToSend, attachToSend = null) => {
    const text = (textToSend || '').trim();
    const currentAttach = attachToSend || attachment;

    if (!text && !currentAttach) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text || (currentAttach ? `Análise de anexo: ${currentAttach.name}` : ''),
      attachment: currentAttach
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setAttachment(null);
    setIsTyping(true);

    // Executa o motor assíncrono conectando diretamente ao back_PagueMenos (/chat)
    (async () => {
      try {
        const result = await runAiCommerceEngineAsync({
          prompt: text,
          attachment: currentAttach,
          preferGenerics: text.toLowerCase().includes('genérico') || text.toLowerCase().includes('generico') || text.toLowerCase().includes('barato'),
          sessionId: userSession?.email || 'chat-widget-session'
        });

        const newMsgId = Date.now() + 1;
        const prods = result.recommendedItems || [];

        // Inicializa a seleção de todos os produtos recomendados como marcados por padrão
        if (prods.length > 0) {
          const initialMap = {};
          prods.forEach((p) => {
            initialMap[p.id] = { selected: true, quantity: 1 };
          });
          setItemSelections((prev) => ({
            ...prev,
            [newMsgId]: initialMap
          }));
        }

        const botMsg = {
          id: newMsgId,
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: result.botResponseText || result.rationale || 'Selecionei as melhores opções com procedência e supervisão farmacêutica.',
          products: prods,
          safetyNotice: result.safetyNotice || null,
          savingsTotal: result.savingsTotal || 0,
          rawResult: result
        };

        setMessages((prev) => [...prev, botMsg]);
      } catch (err) {
        console.error('Erro no motor:', err);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: 'Olá! Tive uma oscilação na resposta, mas estou aqui para te ajudar. Você pode me dizer o medicamento ou sintoma que procura?',
            products: []
          }
        ]);
      } finally {
        setIsTyping(false);
      }
    })();
  };

const handleFormSubmit = (e) => {
  e.preventDefault();
  processAndSendMessage(inputText);
};

const handleQuickChip = (chipPrompt) => {
  processAndSendMessage(chipPrompt);
};

return (
  <>
    {/* ====================================================================
          1. CHATBOT FLUTUANTE FECHADO (BOLA + BALÃO)
          ==================================================================== */}
    {!isOpen && (
      <div style={{
        position: isMobile ? 'absolute' : 'fixed',
        bottom: isMobile ? '72px' : '24px',
        right: isMobile ? '16px' : '24px',
        zIndex: 900,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0.65rem',
        pointerEvents: 'auto'
      }}>
        {/* Balão de Fala Dinâmico Interativo */}
        {isBubbleOpen && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #001FD8',
            borderRadius: '16px 16px 4px 16px',
            padding: '0.75rem 1rem',
            boxShadow: '0 8px 24px rgba(0, 31, 216, 0.22)',
            maxWidth: isMobile ? '230px' : '280px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div
              style={{ flex: 1, cursor: 'pointer' }}
              onClick={onToggle}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', fontWeight: 800, color: '#001FD8', marginBottom: '0.2rem' }}>
                <Sparkles size={12} color="#001FD8" />
                <span>Dra. IA Pague Menos</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#1E293B', fontWeight: 600, lineHeight: 1.35, margin: 0 }}>
                "{bubbleMessages[bubbleTextIndex]}"
              </p>
              <span style={{ fontSize: '0.7rem', color: '#001FD8', fontWeight: 800, marginTop: '0.35rem', display: 'inline-block' }}>
                Toque para conversar →
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsBubbleOpen(false)}
              style={{ color: '#94A3B8', padding: '0.1rem', cursor: 'pointer', border: 'none', background: 'transparent' }}
              title="Fechar balão"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Botão Redondo Flutuante da Farmacêutica IA ("A Bola no Site") */}
        <button
          type="button"
          onClick={onToggle}
          style={{
            width: isMobile ? '56px' : '62px',
            height: isMobile ? '56px' : '62px',
            borderRadius: '50%',
            backgroundColor: '#001FD8',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0, 31, 216, 0.45)',
            border: '3px solid #FFFFFF',
            cursor: 'pointer',
            position: 'relative',
            transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
            outline: 'none'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title="Abrir Chatbot com a Farmacêutica IA"
        >
          <Sparkles size={isMobile ? 24 : 27} color="#FDE047" />

          {/* Ponto Verde Pulsante de Status Online */}
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            border: '2.5px solid #FFFFFF',
            boxShadow: '0 0 6px #10B981'
          }} />
        </button>
      </div>
    )}

    {/* ====================================================================
          2. JANELA INTERATIVA DO CHATBOT (QUANDO ABERTO NA BOLA NO SITE)
          ==================================================================== */}
    {isOpen && (
      <div style={{
        position: isMobile ? 'absolute' : 'fixed',
        bottom: isMobile ? '12px' : '24px',
        right: isMobile ? '12px' : '24px',
        left: isMobile ? '12px' : 'auto',
        top: isMobile ? '60px' : 'auto',
        width: isMobile ? 'auto' : '410px',
        height: isMobile ? 'auto' : '620px',
        maxHeight: isMobile ? 'calc(100% - 72px)' : '85vh',
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        boxShadow: '0 12px 40px rgba(0, 31, 216, 0.28), 0 2px 10px rgba(0,0,0,0.08)',
        border: '1.5px solid #BFDBFE',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'fadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>

        {/* Header do Chatbot */}
        <div style={{
          background: 'linear-gradient(135deg, #001FD8 0%, #00127A 100%)',
          color: '#FFFFFF',
          padding: '0.85rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0, 31, 216, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              position: 'relative',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.18)',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Sparkles size={19} color="#FDE047" />
              <span style={{
                position: 'absolute',
                bottom: '-1px',
                right: '-1px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                border: '1.5px solid #001FD8'
              }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <h3 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, letterSpacing: '-0.2px' }}>
                  Dra. IA Pague Menos
                </h3>
                <span style={{
                  fontSize: '0.6rem',
                  backgroundColor: 'rgba(16, 185, 129, 0.25)',
                  color: '#A7F3D0',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '8px',
                  fontWeight: 700
                }}>
                  ONLINE
                </span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#BFDBFE', fontWeight: 600 }}>
                Farmacêutica Clínica 24h • CRF/SP
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {/* Botão de Acesso Direto à Sacola */}
            {onOpenCart && cartItemsCount > 0 && (
              <button
                type="button"
                onClick={onOpenCart}
                style={{
                  backgroundColor: '#E30613',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '0.3rem 0.6rem',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(227, 6, 19, 0.3)'
                }}
                title="Abrir sacola de compras"
              >
                <ShoppingBag size={13} />
                <span>{cartItemsCount}</span>
              </button>
            )}

            {/* Botão de Expandir / Ver em Tela Cheia */}
            {onNavigateToFullPage && (
              <button
                type="button"
                onClick={() => {
                  const lastBotMsg = [...messages].reverse().find((m) => m.rawResult);
                  onNavigateToFullPage(lastBotMsg?.rawResult || null);
                }}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.35rem 0.5rem',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
                title="Expandir para página de consulta completa"
              >
                <Maximize2 size={13} />
                <span>Expandir</span>
              </button>
            )}

            {/* Botão Fechar */}
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Minimizar chat"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Feed de Mensagens do Chat */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0.9rem',
          backgroundColor: '#F8FAFC',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>

          {/* Aviso de Segurança ANVISA */}
          <div style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: '10px',
            padding: '0.45rem 0.65rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.68rem',
            color: '#1E40AF',
            lineHeight: 1.3
          }}>
            <ShieldCheck size={14} color="#001FD8" style={{ flexShrink: 0 }} />
            <span>Supervisão técnica farmacêutica ativa. Selecione produtos no chat para comprar com 1 clique!</span>
          </div>

          {/* Renderização das Mensagens */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '100%'
              }}
            >
              {/* Nome do Remetente e Horário */}
              <div style={{
                fontSize: '0.64rem',
                color: '#64748B',
                fontWeight: 600,
                marginBottom: '0.2rem',
                paddingLeft: msg.sender === 'user' ? '0' : '0.4rem',
                paddingRight: msg.sender === 'user' ? '0.4rem' : '0'
              }}>
                {msg.sender === 'user' ? 'Você' : 'Dra. Sofia • Pague Menos'} • {msg.time}
              </div>

              {/* Balão de Mensagem */}
              <div style={{
                backgroundColor: msg.sender === 'user' ? '#001FD8' : '#FFFFFF',
                color: msg.sender === 'user' ? '#FFFFFF' : '#0F172A',
                borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                padding: '0.75rem 0.95rem',
                maxWidth: '92%',
                fontSize: '0.82rem',
                lineHeight: 1.45,
                boxShadow: msg.sender === 'user' ? '0 2px 8px rgba(0, 31, 216, 0.25)' : '0 2px 8px rgba(0,0,0,0.05)',
                border: msg.sender === 'user' ? 'none' : '1px solid #E2E8F0',
                wordBreak: 'break-word'
              }}>
                {/* Prévia de Anexo do Usuário */}
                {msg.attachment && (
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.18)',
                    borderRadius: '8px',
                    padding: '0.35rem 0.55rem',
                    marginBottom: '0.45rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}>
                    <FileText size={14} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                      {msg.attachment.name}
                    </span>
                  </div>
                )}

                <FormattedChatMessage
                  text={msg.text}
                  isUser={msg.sender === 'user'}
                />

                {/* Alerta de Medicamento Controlado */}
                {msg.safetyNotice?.isControlled && (
                  <div style={{
                    marginTop: '0.6rem',
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: '10px',
                    padding: '0.55rem 0.75rem',
                    color: '#991B1B'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 800, fontSize: '0.74rem', marginBottom: '0.2rem' }}>
                      <AlertTriangle size={13} color="#DC2626" />
                      <span>Medicamento Sob Controle Especial (ANVISA)</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.7rem', lineHeight: 1.35, color: '#7F1D1D' }}>
                      Exige validação e retenção de receita médica oficial.
                    </p>
                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          backgroundColor: '#DC2626',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.3rem 0.6rem',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <Paperclip size={11} />
                        <span>Anexar Receita</span>
                      </button>
                      {onOpenCamera && (
                        <button
                          type="button"
                          onClick={onOpenCamera}
                          style={{
                            backgroundColor: '#FFFFFF',
                            color: '#DC2626',
                            border: '1px solid #DC2626',
                            borderRadius: '8px',
                            padding: '0.3rem 0.6rem',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <Camera size={11} />
                          <span>Tirar Foto</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* ====================================================================
                      LINHA DE SELEÇÃO E COMPRA DE PRODUTOS NO CHAT
                      ==================================================================== */}
                {msg.products && msg.products.length > 0 && (() => {
                  const allSelected = msg.products.every((p) => getSelection(msg.id, p.id).selected);
                  const selectedProducts = getSelectedProducts(msg.id, msg.products);
                  const selectedCount = selectedProducts.length;
                  const selectedTotal = selectedProducts.reduce((acc, s) => acc + (s.product.price ?? s.product.clubPrice ?? 0) * s.quantity, 0);

                  return (
                    <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      {/* Barra Superior de Seleção de Produtos no Chat */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#EFF6FF',
                        border: '1.5px solid #BFDBFE',
                        borderRadius: '10px',
                        padding: '0.4rem 0.65rem',
                        fontSize: '0.72rem'
                      }}>
                        <label
                          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontWeight: 800, color: '#001FD8', userSelect: 'none' }}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSelectAll(msg.id, msg.products);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={() => { }}
                            style={{ width: '15px', height: '15px', accentColor: '#001FD8', cursor: 'pointer' }}
                          />
                          <span>Selecionar todos ({msg.products.length})</span>
                        </label>

                        <span style={{ fontWeight: 800, color: '#1E40AF' }}>
                          {selectedCount} item(ns) • R$ {selectedTotal.toFixed(2).replace('.', ',')}
                        </span>
                      </div>

                      {/* Cards de Produtos com Seleção, Imagem, Preço e Quantidade */}
                      {msg.products.map((prod) => {
                        const itemSel = getSelection(msg.id, prod.id);
                        const isSelected = itemSel.selected;
                        const inCartItem = cartItems.find((i) => i.product.id === prod.id);

                        return (
                          <div
                            key={prod.id}
                            style={{
                              backgroundColor: isSelected ? '#F0F9FF' : '#F8FAFC',
                              border: isSelected ? '1.5px solid #0284C7' : '1px solid #E2E8F0',
                              borderRadius: '12px',
                              padding: '0.55rem',
                              display: 'flex',
                              gap: '0.55rem',
                              alignItems: 'center',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {/* Checkbox de Seleção Individual */}
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(msg.id, prod.id)}
                              style={{
                                width: '18px',
                                height: '18px',
                                accentColor: '#001FD8',
                                cursor: 'pointer',
                                flexShrink: 0
                              }}
                              title={isSelected ? 'Desmarcar produto' : 'Marcar para comprar'}
                            />

                            <img
                              src={prod.image}
                              alt={prod.name}
                              style={{
                                width: '44px',
                                height: '44px',
                                objectFit: 'contain',
                                borderRadius: '8px',
                                flexShrink: 0,
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E2E8F0'
                              }}
                            />

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {prod.name}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#001FD8' }}>
                                  R$ {(prod.price ?? prod.clubPrice ?? 0).toFixed(2).replace('.', ',')}
                                </span>
                                {prod.originalPrice && prod.originalPrice > (prod.price ?? prod.clubPrice) && (
                                  <span style={{ fontSize: '0.65rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                                    R$ {prod.originalPrice.toFixed(2).replace('.', ',')}
                                  </span>
                                )}
                                {prod.isGeneric && (
                                  <span style={{ fontSize: '0.58rem', fontWeight: 800, backgroundColor: '#DCFCE7', color: '#166534', padding: '0.05rem 0.3rem', borderRadius: '4px' }}>
                                    Genérico
                                  </span>
                                )}
                                {inCartItem && (
                                  <span style={{ fontSize: '0.58rem', fontWeight: 800, backgroundColor: '#E0F2FE', color: '#0284C7', padding: '0.05rem 0.35rem', borderRadius: '4px' }}>
                                    ✓ Na sacola ({inCartItem.quantity})
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Stepper de Quantidade [-] 1 [+] */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #CBD5E1',
                              borderRadius: '16px',
                              padding: '0.1rem 0.35rem',
                              flexShrink: 0
                            }}>
                              <button
                                type="button"
                                onClick={() => updateQuantity(msg.id, prod.id, -1)}
                                style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0.1rem', color: '#64748B', fontWeight: 800, fontSize: '0.8rem' }}
                                title="Diminuir quantidade"
                              >
                                -
                              </button>
                              <span style={{ fontSize: '0.72rem', fontWeight: 800, minWidth: '14px', textAlign: 'center' }}>
                                {itemSel.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(msg.id, prod.id, 1)}
                                style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0.1rem', color: '#64748B', fontWeight: 800, fontSize: '0.8rem' }}
                                title="Aumentar quantidade"
                              >
                                +
                              </button>
                            </div>

                            {/* Botão de Compra Individual */}
                            <button
                              type="button"
                              onClick={() => {
                                if (onAddBatchToCart) {
                                  onAddBatchToCart([{ product: prod, quantity: itemSel.quantity }]);
                                } else if (onAddToCart) {
                                  for (let i = 0; i < itemSel.quantity; i++) {
                                    onAddToCart(prod);
                                  }
                                }
                              }}
                              style={{
                                backgroundColor: '#E30613',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.4rem 0.55rem',
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.2rem',
                                cursor: 'pointer',
                                flexShrink: 0
                              }}
                              title="Adicionar este item à sacola"
                            >
                              <ShoppingBag size={12} />
                              <span>{inCartItem ? '+ Qtd' : 'Comprar'}</span>
                            </button>
                          </div>
                        );
                      })}

                      {/* Botão Principal: COMPRAR SELECIONADOS NO CHAT */}
                      <button
                        type="button"
                        disabled={selectedCount === 0}
                        onClick={() => handleBuySelected(msg.id, msg.products)}
                        style={{
                          backgroundColor: selectedCount > 0 ? '#001FD8' : '#94A3B8',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '0.65rem 0.85rem',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.45rem',
                          cursor: selectedCount > 0 ? 'pointer' : 'not-allowed',
                          boxShadow: selectedCount > 0 ? '0 4px 14px rgba(0, 31, 216, 0.35)' : 'none',
                          transition: 'all 0.15s ease',
                          marginTop: '0.2rem'
                        }}
                      >
                        <ShoppingBag size={15} />
                        <span>
                          {selectedCount > 0
                            ? `Comprar Selecionados (${selectedCount} itens • R$ ${selectedTotal.toFixed(2).replace('.', ',')})`
                            : 'Selecione os produtos acima para comprar'}
                        </span>
                      </button>

                      {/* Botão para Ver Análise Detalhada na Página Dedicada */}
                      {onNavigateToFullPage && msg.rawResult && (
                        <button
                          type="button"
                          onClick={() => onNavigateToFullPage(msg.rawResult)}
                          style={{
                            marginTop: '0.2rem',
                            backgroundColor: '#EFF6FF',
                            color: '#001FD8',
                            border: '1px solid #BFDBFE',
                            borderRadius: '10px',
                            padding: '0.45rem',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.3rem',
                            cursor: 'pointer'
                          }}
                        >
                          <span>Ver análise detalhada da cesta</span>
                          <ArrowRight size={12} />
                        </button>
                      )}

                      {/* Chips de Continuidade / Dúvidas Dinâmicas */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.45rem' }}>
                        <button
                          type="button"
                          onClick={() => handleQuickChip('Quais são os genéricos mais baratos equivalentes a estes?')}
                          style={{
                            fontSize: '0.66rem',
                            fontWeight: 700,
                            padding: '0.25rem 0.55rem',
                            borderRadius: '12px',
                            backgroundColor: '#EFF6FF',
                            color: '#001FD8',
                            border: '1px solid #BFDBFE',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <span>🔄 Ver genéricos mais baratos</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickChip('Como tomar e quais os cuidados e contraindicações desses itens?')}
                          style={{
                            fontSize: '0.66rem',
                            fontWeight: 700,
                            padding: '0.25rem 0.55rem',
                            borderRadius: '12px',
                            backgroundColor: '#F8FAFC',
                            color: '#334155',
                            border: '1px solid #CBD5E1',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <span>🩺 Orientações de uso</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          ))}

          {/* Indicador de Digitação da IA */}
          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#001FD8', fontSize: '0.74rem', fontWeight: 700, paddingLeft: '0.5rem' }}>
              <Sparkles size={14} className="animate-spin" />
              <span>Dra. Sofia está analisando sua solicitação...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ====================================================================
              BARRA DE ACESSO RÁPIDO À SACOLA / CARRINHO DENTRO DO CHAT
              ==================================================================== */}
        {cartItemsCount > 0 && onOpenCart && (
          <div
            onClick={onOpenCart}
            style={{
              backgroundColor: '#FEF2F2',
              borderTop: '1px solid #FECACA',
              borderBottom: '1px solid #FECACA',
              padding: '0.45rem 0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'background 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <div style={{
                backgroundColor: '#E30613',
                color: '#FFFFFF',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShoppingBag size={13} />
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#991B1B' }}>
                  Sua Sacola: {cartItemsCount} item(ns)
                </span>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#E30613', marginLeft: '0.35rem' }}>
                  • R$ {cartTotal.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <div style={{
              backgroundColor: '#E30613',
              color: '#FFFFFF',
              padding: '0.2rem 0.6rem',
              borderRadius: '20px',
              fontSize: '0.68rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem'
            }}>
              <span>Ver Sacola</span>
              <ArrowRight size={11} />
            </div>
          </div>
        )}

        {/* Pílulas de Sugestão Rápida */}
        <div style={{
          padding: '0.45rem 0.75rem',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          gap: '0.35rem',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          {[
            { label: '💊 Genéricos baratos', prompt: 'trocar por genéricos mais baratos aprovados' },
            { label: '🤒 Gripe e dor', prompt: 'remédios para alívio de gripe, febre e dor de cabeça' },
            { label: '☀️ Protetor solar até R$ 80', prompt: 'protetor solar toque seco até 80 reais' },
            { label: '👶 Fraldas e bebê', prompt: 'fraldas e cuidados para bebê' },
            { label: '📋 Validar receita', prompt: 'validar receita médica digital' }
          ].map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => handleQuickChip(chip.prompt)}
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                padding: '0.25rem 0.55rem',
                borderRadius: '14px',
                backgroundColor: '#EFF6FF',
                color: '#001FD8',
                border: '1px solid #BFDBFE',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Preview de Anexo Selecionado Antes de Enviar */}
        {attachment && (
          <div style={{
            backgroundColor: '#EFF6FF',
            borderTop: '1px solid #BFDBFE',
            padding: '0.35rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.72rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {attachment.previewUrl ? (
                <img src={attachment.previewUrl} alt="Preview" style={{ width: '22px', height: '22px', borderRadius: '4px', objectFit: 'cover' }} />
              ) : (
                <FileText size={16} color="#001FD8" />
              )}
              <span style={{ fontWeight: 700, color: '#0F172A', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {attachment.name}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAttachment(null)}
              style={{ color: '#64748B', border: 'none', background: 'transparent', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Barra de Entrada / Digitação no Chat */}
        <form
          onSubmit={handleFormSubmit}
          style={{
            padding: '0.65rem 0.75rem',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          {/* Input oculto para anexar arquivos */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />

          {/* Botão Câmera */}
          {onOpenCamera && (
            <button
              type="button"
              onClick={onOpenCamera}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: '#EFF6FF',
                color: '#001FD8',
                border: '1px solid #BFDBFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
              title="Tirar foto do medicamento ou receita"
            >
              <Camera size={16} />
            </button>
          )}

          {/* Botão Anexar Arquivo */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: attachment ? '#FEF2F2' : '#F8FAFC',
              color: attachment ? '#DC2626' : '#64748B',
              border: '1px solid #CBD5E1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
            title="Anexar foto do remédio ou PDF de receita"
          >
            <Paperclip size={16} />
          </button>

          {/* Campo de Texto */}
          <input
            type="text"
            placeholder="Fale com a Farmacêutica IA..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{
              flex: 1,
              border: '1.5px solid #CBD5E1',
              borderRadius: '20px',
              padding: '0.45rem 0.85rem',
              fontSize: '0.82rem',
              outline: 'none',
              backgroundColor: '#F8FAFC',
              color: '#0F172A'
            }}
            onFocus={(e) => (e.target.style.borderColor = '#001FD8')}
            onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
          />

          {/* Botão Enviar */}
          <button
            type="submit"
            disabled={!inputText.trim() && !attachment}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: inputText.trim() || attachment ? '#001FD8' : '#94A3B8',
              color: '#FFFFFF',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: inputText.trim() || attachment ? 'pointer' : 'not-allowed',
              flexShrink: 0,
              boxShadow: inputText.trim() || attachment ? '0 3px 10px rgba(0, 31, 216, 0.35)' : 'none',
              transition: 'background 0.15s ease'
            }}
            title="Enviar mensagem"
          >
            <Send size={15} />
          </button>
        </form>

      </div>
    )}
  </>
);
}

export default ChatbotWidget;
