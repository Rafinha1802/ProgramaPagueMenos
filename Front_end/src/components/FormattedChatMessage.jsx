import React from 'react';
import { ShieldCheck, AlertTriangle, Info, ExternalLink } from 'lucide-react';

// Regex para identificar elementos inline: negrito-itálico, negrito, itálico, código, links e preços
const INLINE_REGEX = /(\*\*\*[^*]+?\*\*\*|\*\*[^*]+?\*\*|\*[^*\n]+?\*|__[^_]+?__|_[^_\n]+?_|`[^`\n]+?`|\[[^\]]+\]\([^)]+\)|R\$\s*\d+(?:[.,]\d{2})?)/g;

/**
 * Renderiza tokens inline (negrito, itálico, links, códigos e preços)
 */
function renderInline(text, isUser = false) {
  if (!text) return null;

  const parts = text.split(INLINE_REGEX);

  return parts.map((part, index) => {
    if (!part) return null;

    // Negrito + Itálico (***texto***)
    if (part.startsWith('***') && part.endsWith('***') && part.length >= 6) {
      return (
        <strong key={index} style={{ fontWeight: 700, fontStyle: 'italic', color: isUser ? '#FFFFFF' : '#0F172A' }}>
          {part.slice(3, -3)}
        </strong>
      );
    }

    // Negrito (**texto** ou __texto__)
    if ((part.startsWith('**') && part.endsWith('**') && part.length >= 4) ||
        (part.startsWith('__') && part.endsWith('__') && part.length >= 4)) {
      return (
        <strong key={index} style={{ fontWeight: 750, color: isUser ? '#FFFFFF' : '#0F172A' }}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Itálico (*texto* ou _texto_)
    if ((part.startsWith('*') && part.endsWith('*') && part.length >= 2) ||
        (part.startsWith('_') && part.endsWith('_') && part.length >= 2)) {
      return (
        <em key={index} style={{ fontStyle: 'italic', opacity: isUser ? 0.95 : 0.9 }}>
          {part.slice(1, -1)}
        </em>
      );
    }

    // Código em linha (`código`)
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={index}
          style={{
            backgroundColor: isUser ? 'rgba(255, 255, 255, 0.2)' : '#F1F5F9',
            color: isUser ? '#FFFFFF' : '#0F172A',
            border: isUser ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid #CBD5E1',
            borderRadius: '4px',
            padding: '0.1rem 0.35rem',
            fontSize: '0.82em',
            fontFamily: 'monospace',
            fontWeight: 600
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Preços monetários reais (R$ XX,XX)
    if (/^R\$\s*\d+(?:[.,]\d{2})?$/.test(part)) {
      return (
        <span
          key={index}
          style={{
            fontWeight: 800,
            color: isUser ? '#FFFFFF' : '#008744',
            backgroundColor: isUser ? 'transparent' : '#ECFDF5',
            padding: isUser ? '0' : '0.05rem 0.3rem',
            borderRadius: '4px',
            border: isUser ? 'none' : '1px solid #A7F3D0',
            whiteSpace: 'nowrap'
          }}
        >
          {part}
        </span>
      );
    }

    // Links markdown [texto](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: isUser ? '#BAE6FD' : '#001FD8',
            textDecoration: 'underline',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.15rem'
          }}
        >
          <span>{linkMatch[1]}</span>
          <ExternalLink size={10} />
        </a>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

/**
 * Extrai avisos regulatórios de rodapé da Anvisa para estilizá-los em cards especiais
 */
function extractDisclaimer(rawText) {
  if (!rawText) return { cleanText: '', disclaimer: null };

  const disclaimerRegex = /(?:(?:\n|\s)*(?:💡\s*)?(?:\*)?Este assistente não diagnostica[^\n*]*\*?\s*(?:\*)?AO PERSISTIREM OS SINTOMAS[^\n*]*\*?)/i;
  let disclaimer = null;
  let cleanText = rawText;

  const dMatch = rawText.match(disclaimerRegex);
  if (dMatch) {
    cleanText = rawText.replace(disclaimerRegex, '').trim();
    disclaimer = dMatch[0].replace(/[💡*]/g, '').trim();
  }

  // Se houver apenas a frase isolada no fim
  const sintomasRegex = /(?:(?:\n|\s)*\*?AO PERSISTIREM OS SINTOMAS, O MÉDICO DEVERÁ SER CONSULTADO\.?\*?)/i;
  const sMatch = cleanText.match(sintomasRegex);
  if (sMatch && !disclaimer) {
    cleanText = cleanText.replace(sintomasRegex, '').trim();
    disclaimer = 'AO PERSISTIREM OS SINTOMAS, O MÉDICO DEVERÁ SER CONSULTADO.';
  }

  return { cleanText, disclaimer };
}

/**
 * Divide o texto em blocos estruturados (parágrafos, listas, avisos)
 */
function parseTextToBlocks(text) {
  if (!text) return [];

  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let currentParagraph = [];
  let currentList = null;

  function flushParagraph() {
    if (currentParagraph.length > 0) {
      blocks.push({ type: 'paragraph', lines: [...currentParagraph] });
      currentParagraph = [];
    }
  }

  function flushList() {
    if (currentList) {
      blocks.push({
        type: currentList.type === 'ul' ? 'unordered-list' : 'ordered-list',
        items: [...currentList.items]
      });
      currentList = null;
    }
  }

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    // Aviso Regulatório de bloqueio completo
    if (trimmed.startsWith('⚠️') || (trimmed.startsWith('**Aviso Regulatório') && blocks.length === 0)) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'warning-callout', text: trimmed });
      continue;
    }

    // Cabeçalho Markdown (### ou ##)
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        text: headingMatch[2]
      });
      continue;
    }

    // Citação Markdown (> citação)
    const quoteMatch = trimmed.match(/^>\s+(.+)$/);
    if (quoteMatch) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'quote', text: quoteMatch[1] });
      continue;
    }

    // Lista não-ordenada (* item, - item, • item)
    const ulMatch = trimmed.match(/^[-*•]\s+(.+)$/);
    if (ulMatch) {
      flushParagraph();
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(ulMatch[1]);
      continue;
    }

    // Lista ordenada (1. item, 2. item)
    const olMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      flushParagraph();
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(olMatch[1]);
      continue;
    }

    // Linha comum de parágrafo
    flushList();
    currentParagraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  return blocks;
}

/**
 * Componente principal para formatação rica de mensagens do chat
 */
export function FormattedChatMessage({ text = '', isUser = false, style = {} }) {
  if (!text || typeof text !== 'string') {
    return null;
  }

  // Se a mensagem for do usuário, formata com espaçamento simples
  if (isUser) {
    const lines = text.split('\n');
    return (
      <div style={{ lineHeight: 1.5, ...style }}>
        {lines.map((line, idx) => (
          <React.Fragment key={idx}>
            {renderInline(line, true)}
            {idx < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
    );
  }

  // Extrai o disclaimer regulatório de rodapé para card dedicado
  const { cleanText, disclaimer } = extractDisclaimer(text);
  const blocks = parseTextToBlocks(cleanText);

  return (
    <div style={{ lineHeight: 1.55, color: '#0F172A', ...style }}>
      {blocks.map((block, bIdx) => {
        const isLastBlock = bIdx === blocks.length - 1;

        // 1. Parágrafos comuns
        if (block.type === 'paragraph') {
          return (
            <p
              key={bIdx}
              style={{
                margin: isLastBlock && !disclaimer ? '0' : '0 0 0.6rem 0',
                fontSize: '0.82rem',
                lineHeight: 1.55
              }}
            >
              {block.lines.map((line, lIdx) => (
                <React.Fragment key={lIdx}>
                  {renderInline(line, false)}
                  {lIdx < block.lines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          );
        }

        // 2. Listas não-ordenadas (bullets)
        if (block.type === 'unordered-list') {
          return (
            <ul
              key={bIdx}
              style={{
                margin: '0.35rem 0 0.65rem 0',
                paddingLeft: '1.15rem',
                fontSize: '0.82rem',
                lineHeight: 1.5
              }}
            >
              {block.items.map((item, iIdx) => (
                <li key={iIdx} style={{ marginBottom: '0.28rem' }}>
                  {renderInline(item, false)}
                </li>
              ))}
            </ul>
          );
        }

        // 3. Listas ordenadas (numeradas)
        if (block.type === 'ordered-list') {
          return (
            <ol
              key={bIdx}
              style={{
                margin: '0.35rem 0 0.65rem 0',
                paddingLeft: '1.25rem',
                fontSize: '0.82rem',
                lineHeight: 1.5
              }}
            >
              {block.items.map((item, iIdx) => (
                <li key={iIdx} style={{ marginBottom: '0.28rem' }}>
                  {renderInline(item, false)}
                </li>
              ))}
            </ol>
          );
        }

        // 4. Cabeçalhos (### Título)
        if (block.type === 'heading') {
          return (
            <div
              key={bIdx}
              style={{
                fontWeight: 800,
                fontSize: block.level <= 2 ? '0.92rem' : '0.86rem',
                color: '#001FD8',
                marginTop: bIdx > 0 ? '0.65rem' : '0',
                marginBottom: '0.35rem'
              }}
            >
              {renderInline(block.text, false)}
            </div>
          );
        }

        // 5. Citações (> citação)
        if (block.type === 'quote') {
          return (
            <blockquote
              key={bIdx}
              style={{
                margin: '0.4rem 0 0.65rem 0',
                padding: '0.4rem 0.75rem',
                borderLeft: '3px solid #001FD8',
                backgroundColor: '#F8FAFC',
                borderRadius: '0 8px 8px 0',
                fontSize: '0.8rem',
                fontStyle: 'italic',
                color: '#334155'
              }}
            >
              {renderInline(block.text, false)}
            </blockquote>
          );
        }

        // 6. Alerta ou Aviso Regulatório Geral
        if (block.type === 'warning-callout') {
          return (
            <div
              key={bIdx}
              style={{
                margin: '0.4rem 0 0.65rem 0',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderLeft: '4px solid #DC2626'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 800,
                  fontSize: '0.76rem',
                  color: '#991B1B',
                  marginBottom: '0.3rem'
                }}
              >
                <AlertTriangle size={14} color="#DC2626" />
                <span>Aviso Regulatório Anvisa</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#7F1D1D', lineHeight: 1.45 }}>
                {renderInline(block.text.replace(/^⚠️\s*/, ''), false)}
              </div>
            </div>
          );
        }

        return null;
      })}

      {/* Card Regulatório ANVISA Dedicado e Elegante de Rodapé */}
      {disclaimer && (
        <div
          style={{
            marginTop: '0.75rem',
            padding: '0.55rem 0.75rem',
            borderRadius: '10px',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderLeft: '3px solid #001FD8',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'flex-start'
          }}
        >
          <ShieldCheck size={14} color="#001FD8" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
          <div style={{ fontSize: '0.71rem', color: '#475569', lineHeight: 1.45 }}>
            <div
              style={{
                fontWeight: 800,
                color: '#1E293B',
                fontSize: '0.66rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '0.2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <span>Orientação de Saúde & ANVISA</span>
            </div>
            <div>
              {renderInline(disclaimer, false)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormattedChatMessage;
