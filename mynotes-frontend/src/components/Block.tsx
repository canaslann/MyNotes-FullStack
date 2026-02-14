import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Block as BlockType, BlockType as BType } from '@/types';
import { 
  Heading1, 
  List, 
  CheckSquare, 
  Trash2,
  Type,
} from 'lucide-react';
import { useBlockStore } from '@/stores/blockStore';

interface BlockProps {
  block: BlockType | null;
  pageId: string;
}

interface Command {
  icon: React.ReactNode;
  label: string;
  type: BType;
  keywords: string[];
}

export const Block: React.FC<BlockProps> = ({ block, pageId }) => {
  const [content, setContent] = useState(block?.content || '');
  const [blockType, setBlockType] = useState<BType>(block?.type || BType.TEXT);
  const [isChecked, setIsChecked] = useState(block?.properties?.checked || false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { createBlock, updateBlock, deleteBlock } = useBlockStore();

  const commands: Command[] = [
    { 
      icon: <Type size={16} />, 
      label: 'Text', 
      type: BType.TEXT,
      keywords: ['text', 'paragraph', 'p']
    },
    { 
      icon: <Heading1 size={16} />, 
      label: 'Heading 1', 
      type: BType.HEADING,
      keywords: ['heading', 'h1', 'title', 'header']
    },
    { 
      icon: <List size={16} />, 
      label: 'Bulleted list', 
      type: BType.BULLET,
      keywords: ['bullet', 'list', 'ul', '-']
    },
    { 
      icon: <CheckSquare size={16} />, 
      label: 'To-do list', 
      type: BType.TODO,
      keywords: ['todo', 'task', 'checkbox', '[]']
    },
  ];

  const filteredCommands = searchQuery
    ? commands.filter((cmd) =>
        cmd.keywords.some((keyword) =>
          keyword.toLowerCase().includes(searchQuery.toLowerCase())
        ) || cmd.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : commands;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    // Detect "/" at start of line
    if (value === '/') {
      setShowSlashMenu(true);
      setSelectedIndex(0);
      setSearchQuery('');
      return;
    }
    
    if (value.startsWith('/')) {
      setShowSlashMenu(true);
      setSearchQuery(value.slice(1));
      return;
    }
    
    setShowSlashMenu(false);
    setContent(value);
    
    // Auto-save for existing blocks
    if (block) {
      saveBlock(value, blockType, { checked: isChecked });
    }
  };


  const focusPreviousBlock = () => {
    const currentTextarea = textareaRef.current;
    if (!currentTextarea) return;

    const allTextareas = Array.from(document.querySelectorAll('textarea'));
    const currentIndex = allTextareas.indexOf(currentTextarea);
    
    if (currentIndex > 0) {
      const prevTextarea = allTextareas[currentIndex - 1] as HTMLTextAreaElement;
      prevTextarea.focus();
      prevTextarea.setSelectionRange(prevTextarea.value.length, prevTextarea.value.length);
    }
  };

  const focusNextBlock = () => {
    const currentTextarea = textareaRef.current;
    if (!currentTextarea) return;

    const allTextareas = Array.from(document.querySelectorAll('textarea'));
    const currentIndex = allTextareas.indexOf(currentTextarea);
    
    if (currentIndex < allTextareas.length - 1) {
      const nextTextarea = allTextareas[currentIndex + 1] as HTMLTextAreaElement;
      nextTextarea.focus();
      nextTextarea.setSelectionRange(0, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // SLASH MENU KONTROLÜ
    if (showSlashMenu) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        selectCommand(filteredCommands[selectedIndex].type);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowSlashMenu(false);
        setContent('');
      }
      return;
    }

    // YUKARI OK - Üst bloğa geç
    if (e.key === 'ArrowUp') {
      const textarea = textareaRef.current;
      if (textarea && textarea.selectionStart === 0) {
        e.preventDefault();
        focusPreviousBlock();
      }
    }

    // AŞAĞI OK - Alt bloğa geç
    if (e.key === 'ArrowDown') {
      const textarea = textareaRef.current;
      if (textarea) {
        const isAtEnd = textarea.selectionStart === textarea.value.length;
        if (isAtEnd) {
          e.preventDefault();
          focusNextBlock();
        }
      }
    }

    // ENTER - Yeni block
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnter();
    }

    // BACKSPACE - BOŞ SATIRDA
    if (e.key === 'Backspace' && content === '') {
      e.preventDefault();
      
      if (block) {
        // Eğer block tipi TODO, BULLET veya HEADING ise → TEXT'e çevir
        if (blockType === BType.TODO || blockType === BType.BULLET || blockType === BType.HEADING) {
          // Tipi TEXT'e çevir ve devam et
          setBlockType(BType.TEXT);
          setIsChecked(false);
          
          // Backend'e de gönder
          updateBlock(block.id, {
            type: BType.TEXT,
            content: '',
            properties: {},
          });
        } else {
          // Zaten TEXT ise bloğu sil
          deleteBlock(block.id);
          focusPreviousBlock();
        }
      }
    }
  };

  const selectCommand = (type: BType) => {
    setBlockType(type);
    setContent('');
    setShowSlashMenu(false);
    setSearchQuery('');
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleEnter = async () => {
    if (!pageId) return;

    // Mevcut block'u kaydet (eğer içerik varsa)
    if (block && content.trim()) {
      await updateBlock(block.id, {
        content: content.trim(),
        type: blockType,
        properties: { checked: isChecked },
      });
    } else if (!block && content.trim()) {
      // Yeni block oluştur (ilk block için)
      await createBlock({
        type: blockType,
        content: content.trim(),
        parentId: pageId,
        properties: { checked: isChecked },
      });
    }

    // YENİ BLOCK OLUŞTUR - AMA AYNİ TİPLE!
    // Todo, Bullet, Heading devam etsin, Text ise Text kalsın
    const nextBlockType = blockType; // ← Aynı tipi koru
    
    await createBlock({
      type: nextBlockType,  // ← Aynı tip
      content: '',
      parentId: pageId,
      properties: blockType === BType.TODO ? { checked: false } : {},  // Todo ise unchecked başlat
    });
  };

  const saveBlock = async (newContent: string, newType: BType, properties: any) => {
    if (!block) return;
    
    await updateBlock(block.id, {
      content: newContent,
      type: newType,
      properties,
    });
  };

  const handleCheckToggle = async () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    
    if (block) {
      await saveBlock(content, blockType, { checked: newChecked });
    }
  };

  const handleDelete = async () => {
    if (block) {
      await deleteBlock(block.id);
    }
  };

  const getPlaceholder = () => {
    if (showSlashMenu) return 'Type to search...';
    
    switch (blockType) {
      case BType.HEADING:
        return 'Heading';
      case BType.TODO:
        return 'To-do';
      case BType.BULLET:
        return 'List';
      default:
        return "Type '/' for commands";
    }
  };

  const getTextClass = () => {
    switch (blockType) {
      case BType.HEADING:
        return 'text-2xl font-bold font-serif';
      default:
        return 'text-base';
    }
  };

  return (
    <div className="group relative">
      <div className="flex items-start gap-2 py-1 hover:bg-gray-50/50 rounded transition-colors min-h-[32px]">
        {/* Icon */}
        <div className="flex-shrink-0 w-6 flex items-center justify-center mt-1.5">
          {blockType === BType.HEADING && <Heading1 size={16} className="text-primary" />}
          {blockType === BType.BULLET && <div className="w-1.5 h-1.5 rounded-full bg-dark" />}
          {blockType === BType.TODO && (
            <button onClick={handleCheckToggle} className="flex items-center">
              <div className={`w-4 h-4 border-2 border-dark flex items-center justify-center ${isChecked ? 'bg-primary' : 'bg-white'}`}>
                {isChecked && (
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3 text-dark">
                    <path d="M3 8l3 3 7-7" />
                  </svg>
                )}
              </div>
            </button>
          )}
          {/* TEXT için artık hiçbir şey gösterme */}
        </div>

        {/* Content */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholder()}
            className={`w-full bg-transparent border-none outline-none resize-none ${getTextClass()} ${
              isChecked ? 'line-through text-gray-400' : 'text-dark'
            } placeholder-gray-400`}
            rows={1}
          />

          {/* Slash Menu */}
          <AnimatePresence>
            {showSlashMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-50 min-w-[280px] overflow-hidden"
              >
                <div className="p-1">
                  {filteredCommands.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-400">No results</div>
                  ) : (
                    filteredCommands.map((cmd, index) => (
                      <button
                        key={cmd.type}
                        onClick={() => selectCommand(cmd.type)}
                        className={`flex items-center gap-3 w-full px-3 py-2 text-left rounded transition-colors ${
                          index === selectedIndex
                            ? 'bg-primary/10 text-dark'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className={index === selectedIndex ? 'text-primary' : 'text-gray-500'}>
                          {cmd.icon}
                        </div>
                        <span className="text-sm font-medium">{cmd.label}</span>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Delete */}
        {block && (
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-purple-50 rounded transition-opacity mt-1"
          >
            <Trash2 size={14} className="text-purple-500" />
          </button>
        )}
      </div>
    </div>
  );
};