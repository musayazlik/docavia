"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { CornerDownRight } from "lucide-react";
import { seedComments, type BlogComment } from "@/lib/data";
import { cn } from "@/lib/utils";

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Avatar({ author, avatar }: { author: string; avatar: string }) {
  if (avatar) {
    return (
      <Image
        src={avatar}
        alt={`Portrait of ${author}`}
        width={44}
        height={44}
        className="size-11 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="font-heading flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary"
    >
      {author.trim().charAt(0).toUpperCase()}
    </span>
  );
}

function CommentCard({
  comment,
  onReply,
  replyTo,
  replyForm,
}: {
  comment: BlogComment;
  onReply: (id: string) => void;
  replyTo: string | null;
  replyForm: React.ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <Avatar author={comment.author} avatar={comment.avatar} />
      <div className="min-w-0 flex-1">
        <p className="font-heading text-[0.95rem] font-bold text-foreground">
          {comment.author}
          <span className="ml-2.5 text-sm font-normal text-muted">
            {comment.date}
          </span>
        </p>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-foreground/75">
          {comment.text}
        </p>
        <button
          type="button"
          onClick={() => onReply(comment.id)}
          aria-expanded={replyTo === comment.id}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors duration-200 hover:text-primary-dark"
        >
          <CornerDownRight className="size-3.5" aria-hidden="true" />
          Reply
        </button>
        {replyTo === comment.id && replyForm}

        {comment.replies.length > 0 && (
          <ul className="mt-6 space-y-6 border-l-2 border-border pl-5 sm:pl-6">
            {comment.replies.map((reply) => (
              <li key={reply.id} className="flex gap-3.5">
                <Avatar author={reply.author} avatar={reply.avatar} />
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-[0.9rem] font-bold text-foreground">
                    {reply.author}
                    <span className="ml-2.5 text-[0.8125rem] font-normal text-muted">
                      {reply.date}
                    </span>
                  </p>
                  <p className="mt-1.5 text-[0.9rem] leading-relaxed text-foreground/75">
                    {reply.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

export function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<BlogComment[]>(
    () => seedComments[slug] ?? []
  );
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState("");

  const total = comments.reduce((sum, c) => sum + 1 + c.replies.length, 0);

  function addComment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = message.trim();
    const author = name.trim();
    if (!author || !text) return;
    setComments((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        author,
        avatar: "",
        date: formatDate(),
        text,
        replies: [],
      },
    ]);
    // keep the name — consecutive comments and replies reuse it
    setMessage("");
  }

  function addReply(e: FormEvent<HTMLFormElement>, parentId: string) {
    e.preventDefault();
    const text = replyMessage.trim();
    const author = name.trim();
    if (!author || !text) return;
    setComments((current) =>
      current.map((comment) =>
        comment.id === parentId
          ? {
              ...comment,
              replies: [
                ...comment.replies,
                {
                  id: crypto.randomUUID(),
                  author,
                  avatar: "",
                  date: formatDate(),
                  text,
                  replies: [],
                },
              ],
            }
          : comment
      )
    );
    setReplyMessage("");
    setReplyTo(null);
  }

  const nameField = (
    <label className="block">
      <span className="sr-only">Your name</span>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        required
        placeholder="Your name"
        className="w-full rounded-2xl border border-border bg-white px-5 py-3.5 text-[0.9375rem] text-foreground transition-colors duration-200 placeholder:text-muted/70 focus:border-primary focus:outline-none"
      />
    </label>
  );

  const textFieldClass =
    "w-full rounded-2xl border border-border bg-white px-5 py-3.5 text-[0.9375rem] leading-relaxed text-foreground transition-colors duration-200 placeholder:text-muted/70 focus:border-primary focus:outline-none";

  const replyForm = (
    <form
      onSubmit={(e) => replyTo && addReply(e, replyTo)}
      className="mt-4 space-y-3 rounded-2xl bg-secondary/60 p-4 sm:p-5"
    >
      {!name.trim() && nameField}
      <label className="block">
        <span className="sr-only">Your reply</span>
        <textarea
          value={replyMessage}
          onChange={(e) => setReplyMessage(e.target.value)}
          rows={3}
          required
          placeholder={
            name.trim()
              ? `Replying as ${name.trim()} — write your reply`
              : "Write your reply"
          }
          className={cn(textFieldClass, "resize-none bg-white")}
        />
      </label>
      <div className="flex justify-end gap-2.5">
        <button
          type="button"
          onClick={() => {
            setReplyTo(null);
            setReplyMessage("");
          }}
          className="rounded-2xl px-5 py-3 text-[0.9375rem] font-semibold text-muted transition-colors duration-200 hover:text-foreground"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-2xl bg-primary px-5 py-3 text-[0.9375rem] font-semibold text-white shadow-[0_12px_28px_-14px_rgb(47_118_109/0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark"
        >
          Post Reply
        </button>
      </div>
    </form>
  );

  return (
    <section aria-label="Comments" className="mt-16 border-t border-border pt-12">
      <h2 className="font-heading text-[1.55rem] font-bold tracking-tight text-foreground">
        Comments
        <span className="ml-3 inline-flex items-center rounded-full bg-secondary px-3 py-1 align-middle text-sm font-semibold text-primary">
          {total}
        </span>
      </h2>

      {comments.length > 0 ? (
        <ul className="mt-9 space-y-9">
          {comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onReply={(id) => {
                setReplyTo((current) => (current === id ? null : id));
                setReplyMessage("");
              }}
              replyTo={replyTo}
              replyForm={replyForm}
            />
          ))}
        </ul>
      ) : (
        <p className="mt-9 text-[0.9375rem] leading-relaxed text-muted">
          No comments yet — be the first to share your thoughts.
        </p>
      )}

      {/* New comment form */}
      <form
        onSubmit={addComment}
        className="mt-12 rounded-[1.75rem] border border-border bg-secondary/40 p-6 sm:p-8"
      >
        <h3 className="font-heading text-lg font-bold text-foreground">
          Leave a comment
        </h3>
        <p className="mt-1.5 text-sm text-muted">
          Questions are welcome — our care team reads every one.
        </p>
        <div className="mt-6 space-y-4">
          {nameField}
          <label className="block">
            <span className="sr-only">Your comment</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
              placeholder="Share your thoughts or ask a question…"
              className={cn(textFieldClass, "resize-none")}
            />
          </label>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="rounded-2xl bg-primary px-6 py-3.5 text-[0.9375rem] font-semibold tracking-[-0.01em] text-white shadow-[0_12px_28px_-14px_rgb(47_118_109/0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark"
          >
            Post Comment
          </button>
        </div>
      </form>
    </section>
  );
}
