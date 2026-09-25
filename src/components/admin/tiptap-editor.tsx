"use client";

import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

function ToolButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={cn(
        "flex size-9 items-center justify-center rounded-lg transition-colors duration-200",
        active
          ? "bg-primary text-white"
          : "text-muted hover:bg-secondary hover:text-foreground",
        disabled && "cursor-not-allowed opacity-30 hover:bg-transparent"
      )}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const setLink = () => {
    const current = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", current ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="sticky top-0 z-10 flex flex-wrap items-center gap-1 rounded-t-2xl border-b border-border bg-secondary/70 px-3 py-2.5 backdrop-blur"
    >
      <ToolButton
        label="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
      >
        <Bold className="size-4" aria-hidden="true" />
      </ToolButton>
      <ToolButton
        label="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
      >
        <Italic className="size-4" aria-hidden="true" />
      </ToolButton>
      <ToolButton
        label="Underline"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
      >
        <UnderlineIcon className="size-4" aria-hidden="true" />
      </ToolButton>
      <ToolButton
        label="Strikethrough"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
      >
        <Strikethrough className="size-4" aria-hidden="true" />
      </ToolButton>

      <span className="mx-1.5 h-6 w-px bg-border" aria-hidden="true" />

      <ToolButton
        label="Heading 2"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
      >
        <Heading2 className="size-4" aria-hidden="true" />
      </ToolButton>
      <ToolButton
        label="Heading 3"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
      >
        <Heading3 className="size-4" aria-hidden="true" />
      </ToolButton>
      <ToolButton
        label="Bullet list"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
      >
        <List className="size-4" aria-hidden="true" />
      </ToolButton>
      <ToolButton
        label="Numbered list"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
      >
        <ListOrdered className="size-4" aria-hidden="true" />
      </ToolButton>
      <ToolButton
        label="Quote"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
      >
        <Quote className="size-4" aria-hidden="true" />
      </ToolButton>

      <span className="mx-1.5 h-6 w-px bg-border" aria-hidden="true" />

      <ToolButton
        label="Add link"
        onClick={setLink}
        active={editor.isActive("link")}
      >
        {editor.isActive("link") ? (
          <Link2Off className="size-4" aria-hidden="true" />
        ) : (
          <Link2 className="size-4" aria-hidden="true" />
        )}
      </ToolButton>

      <span className="ml-auto flex items-center gap-1">
        <ToolButton
          label="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo2 className="size-4" aria-hidden="true" />
        </ToolButton>
        <ToolButton
          label="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo2 className="size-4" aria-hidden="true" />
        </ToolButton>
      </span>
    </div>
  );
}

/**
 * Tiptap v3 rich text editor. Emits both the serialized HTML (rendered on
 * the public site) and the ProseMirror JSON (stored for future migrations).
 */
export function TiptapEditor({
  initialHtml,
  onChange,
}: {
  initialHtml: string;
  onChange: (html: string, json: object) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Placeholder.configure({
        placeholder: "Write the article… Use the toolbar for headings, lists, quotes and links.",
      }),
    ],
    content: initialHtml || "",
    onUpdate: ({ editor: current }) => {
      onChange(current.getHTML(), current.getJSON());
    },
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_1px_2px_rgb(24_63_58/0.05)] focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgb(47_118_109/0.12)]">
      {editor && <Toolbar editor={editor} />}
      <EditorContent
        editor={editor}
        className="article-body tiptap min-h-80 px-6 py-5"
      />
    </div>
  );
}
