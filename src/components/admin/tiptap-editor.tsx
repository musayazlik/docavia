"use client";

import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { Placeholder } from "@tiptap/extensions";
import { useState } from "react";
import {
  Bold,
  Code,
  FileCode,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
  MonitorPlay,
} from "lucide-react";
import { Dialog, FormField, inputClasses } from "@/components/admin/ui/dialog";
import { ImageUploadField } from "@/components/admin/image-upload-field";
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

function Divider() {
  return <span className="mx-1.5 h-6 w-px bg-border" aria-hidden="true" />;
}

function Toolbar({
  editor,
  onOpenImage,
  onOpenYoutube,
}: {
  editor: Editor;
  onOpenImage: () => void;
  onOpenYoutube: () => void;
}) {
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

      <Divider />

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

      <Divider />

      <ToolButton
        label="Inline code"
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive("code")}
      >
        <Code className="size-4" aria-hidden="true" />
      </ToolButton>
      <ToolButton
        label="Code block"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive("codeBlock")}
      >
        <FileCode className="size-4" aria-hidden="true" />
      </ToolButton>
      <ToolButton
        label="Horizontal rule"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus className="size-4" aria-hidden="true" />
      </ToolButton>

      <Divider />

      <ToolButton label="Insert image" onClick={onOpenImage}>
        <ImagePlus className="size-4" aria-hidden="true" />
      </ToolButton>
      <ToolButton
        label="Embed YouTube video"
        onClick={onOpenYoutube}
        active={editor.isActive("youtube")}
      >
        <MonitorPlay className="size-4" aria-hidden="true" />
      </ToolButton>
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
 * The writing area scrolls internally at a capped height; `canUpload`
 * enables the UploadThing picker inside the image dialog.
 */
export function TiptapEditor({
  initialHtml,
  editable = true,
  canUpload = false,
  onChange,
}: {
  initialHtml: string;
  editable?: boolean;
  canUpload?: boolean;
  onChange: (html: string, json: object) => void;
}) {
  const [dialog, setDialog] = useState<"image" | "youtube" | null>(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaError, setMediaError] = useState<string | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    editable,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      Youtube.configure({ controls: true, nocookie: true, width: 800, height: 450 }),
      Placeholder.configure({
        placeholder:
          "Write the article… Use the toolbar for headings, lists, quotes, images and videos.",
      }),
    ],
    content: initialHtml || "",
    onUpdate: ({ editor: current }) => {
      onChange(current.getHTML(), current.getJSON());
    },
  });

  const closeDialog = () => {
    setDialog(null);
    setMediaUrl("");
    setMediaError(null);
  };

  const insertImage = () => {
    if (!editor || !mediaUrl.trim()) {
      setMediaError("Paste an image URL or upload a photo first.");
      return;
    }
    editor.chain().focus().setImage({ src: mediaUrl.trim() }).run();
    closeDialog();
  };

  const insertYoutube = () => {
    if (!editor || !mediaUrl.trim()) {
      setMediaError("Paste a YouTube video URL first.");
      return;
    }
    editor.chain().focus().setYoutubeVideo({ src: mediaUrl.trim() }).run();
    closeDialog();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_1px_2px_rgb(24_63_58/0.05)] focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgb(47_118_109/0.12)]">
      {editor && (
        <Toolbar
          editor={editor}
          onOpenImage={() => {
            setMediaUrl("");
            setMediaError(null);
            setDialog("image");
          }}
          onOpenYoutube={() => {
            setMediaUrl("");
            setMediaError(null);
            setDialog("youtube");
          }}
        />
      )}
      {/* Capped writing area — long articles scroll inside, never stretch the page */}
      <div className="max-h-[36rem] overflow-y-auto">
        <EditorContent
          editor={editor}
          className="article-body tiptap min-h-72 px-6 py-5"
        />
      </div>

      {/* Image dialog */}
      <Dialog
        open={dialog === "image"}
        onClose={closeDialog}
        title="Insert image"
        size="lg"
        description="Paste an image URL, or upload a photo from your computer."
      >
        <div className="space-y-5">
          {canUpload && (
            <ImageUploadField
              label="Upload from computer"
              value={mediaUrl}
              canUpload
              onChange={(url) => setMediaUrl(url)}
              help="Uploaded images are hosted on the site's media CDN."
            />
          )}
          <FormField label="Image URL" htmlFor="editor-image-url">
            <input
              id="editor-image-url"
              type="url"
              className={inputClasses}
              value={mediaUrl}
              placeholder="https://…"
              onChange={(event) => setMediaUrl(event.target.value)}
            />
          </FormField>
          {mediaError && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {mediaError}
            </p>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeDialog}
              className="rounded-xl px-5 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={insertImage}
              className="inline-flex min-w-28 items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-dark"
            >
              Insert image
            </button>
          </div>
        </div>
      </Dialog>

      {/* YouTube dialog */}
      <Dialog
        open={dialog === "youtube"}
        onClose={closeDialog}
        title="Embed YouTube video"
        description="Paste a youtube.com/watch, youtu.be or Shorts link — it becomes a responsive embed."
      >
        <div className="space-y-5">
          <FormField label="Video URL" htmlFor="editor-youtube-url">
            <input
              id="editor-youtube-url"
              type="url"
              className={inputClasses}
              value={mediaUrl}
              placeholder="https://www.youtube.com/watch?v=…"
              onChange={(event) => setMediaUrl(event.target.value)}
            />
          </FormField>
          {mediaError && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {mediaError}
            </p>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeDialog}
              className="rounded-xl px-5 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={insertYoutube}
              className="inline-flex min-w-28 items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-dark"
            >
              Insert video
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
