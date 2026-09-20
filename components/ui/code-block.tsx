"use client";

import * as React from "react";

import { codeToHtml } from "shiki";
import type { BundledLanguage } from "shiki";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckIcon, CopyIcon } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type CodeBlockFile = {
  filename: string;
  code: string;
  language?: BundledLanguage;
  panelClassName?: string;
  paneStyle?: React.CSSProperties;
  highlightLines?: number[];
  highlightClassName?: string;
  showLineNumbers?: boolean;
};

export type CodeBlockProps = React.ComponentProps<"div"> & {
  code?: string;
  language?: BundledLanguage;
  filename?: string;
  files?: CodeBlockFile[];
  panelClassName?: string;
  paneStyle?: React.CSSProperties;
  highlightLines?: number[];
  highlightClassName?: string;
  showLineNumbers?: boolean;
};

// Internal Helpers
function splitShikiLines(html: string): string[] {
  const match = html.match(/<code[^>]*>([\s\S]*?)<\/code>/);

  if (!match) return [html];

  // Split on newlines; last element after trailing newline may be empty
  const lines = match[1].split("\n");

  if (lines[lines.length - 1] === "") lines.pop();

  return lines;
}

async function highlight(
  code: string,
  lang: BundledLanguage = "tsx",
): Promise<string> {
  try {
    return await codeToHtml(code, {
      lang,
      themes: { light: "github-light", dark: "github-dark" },
    });
  } catch {
    // Fallback: wrap in plain-text pre/code so the UI never breaks
    const escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return `<pre><code>${escaped}</code></pre>`;
  }
}

// Copy Button

function CodeBlockCopyButton({
  code,
  className,
  ...props
}: React.ComponentProps<"button"> & { code: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(() => {
    if (typeof navigator === "undefined") return;

    const write = (text: string) => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);

      return text;
    };

    if (
      navigator.clipboard &&
      typeof window !== "undefined" &&
      window.isSecureContext
    ) {
      navigator.clipboard
        .writeText(code)
        .then(() => write(code))
        .catch(() => {
          // Clipboard API rejected — use execCommand fallback silently
          fallbackCopy(code);
          write(code);
        });
    } else {
      fallbackCopy(code);
      write(code);
    }
  }, [code]);

  return (
    <button
      data-slot="code-block-copy"
      aria-label={copied ? "Copied" : "Copy code"}
      onClick={handleCopy}
      className={cn(
        "text-muted-foreground hover:text-foreground inline-flex items-center justify-center rounded-md p-1.5 transition-colors",
        className,
      )}
      {...props}
    >
      {copied ? (
        <CheckIcon className="size-3.5" />
      ) : (
        <CopyIcon className="size-3.5" />
      )}
    </button>
  );
}

function fallbackCopy(text: string) {
  const el = document.createElement("textarea");

  el.value = text;
  el.style.cssText = "position:fixed;top:-9999px;left:-9999px";
  document.body.appendChild(el);
  el.focus();
  el.select();

  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(el);
  }
}

// Single

type CodeBlockPaneProps = {
  code: string;
  language?: BundledLanguage;
  showCopy?: boolean;
  className?: string;
  style?: React.CSSProperties;
  highlightLines?: number[];
  highlightClassName?: string;
  showLineNumbers?: boolean;
};

function CodeBlockPane({
  code,
  language = "tsx",
  showCopy = true,
  className,
  style,
  highlightLines,
  highlightClassName = "bg-amber-400/40",
  showLineNumbers = false,
}: CodeBlockPaneProps) {
  const [html, setHtml] = React.useState<string>("");

  React.useEffect(() => {
    let cancelled = false;

    highlight(code, language).then((result) => {
      if (!cancelled) setHtml(result);
    });

    return () => {
      cancelled = true;
    };
  }, [code, language]);

  const hasHighlights = highlightLines && highlightLines.length > 0;
  const useLineView = hasHighlights || showLineNumbers;

  // Pre-compute Shiki's background so we can match the container
  const lines = React.useMemo(
    () => (html ? splitShikiLines(html) : []),
    [html],
  );

  return (
    <div
      data-slot="code-block-pane"
      className={cn("", className)}
      style={style}
    >
      <ScrollArea className="max-h-43.75 *:data-[slot=scroll-area-viewport]:h-auto! *:data-[slot=scroll-area-viewport]:max-h-43.75">
        {showCopy && (
          <CodeBlockCopyButton
            code={code}
            className="absolute top-2 right-2 z-10"
          />
        )}
        {html ? (
          useLineView ? (
            <>
              <pre className="shiki bg-transparent! p-0 font-mono text-sm leading-relaxed">
                <code className="block w-max min-w-full">
                  {lines.map((line, i) => {
                    const lineNumber = i + 1;
                    const isHighlighted =
                      highlightLines?.includes(lineNumber) ?? false;

                    return (
                      <div
                        key={i}
                        className={cn(
                          "flex items-stretch px-4 py-[0.5px]",
                          isHighlighted && highlightClassName,
                        )}
                      >
                        {showLineNumbers && (
                          <span className="text-muted-foreground/50 mr-4 w-4 shrink-0 text-right font-mono text-xs leading-relaxed select-none">
                            {lineNumber}
                          </span>
                        )}
                        {/* Line tokens are trusted Shiki HTML output */}
                        <span
                          className="flex-1"
                          dangerouslySetInnerHTML={{ __html: line || "&nbsp;" }}
                        />
                      </div>
                    );
                  })}
                </code>
              </pre>
              <ScrollBar orientation="horizontal" />
            </>
          ) : (
            <>
              <div
                className={cn(
                  "[&>pre]:p-4 [&>pre]:text-sm [&>pre]:leading-relaxed",
                  "[&>pre]:bg-transparent! [&>pre]:font-mono [&>pre]:whitespace-pre",
                )}
                dangerouslySetInnerHTML={{ __html: html }}
              />
              <ScrollBar orientation="horizontal" />
            </>
          )
        ) : (
          <pre className="p-4 font-mono text-sm leading-relaxed opacity-0">
            {code}
          </pre>
        )}
      </ScrollArea>
    </div>
  );
}

function CodeBlock({
  code,
  language = "tsx",
  filename,
  files,
  className,
  panelClassName,
  paneStyle,
  highlightLines,
  highlightClassName,
  showLineNumbers,
  ...props
}: CodeBlockProps) {
  // Normalise to a files array so the rest of the component is uniform
  const normalizedFiles: CodeBlockFile[] = React.useMemo(() => {
    if (files && files.length > 0) return files;

    if (code !== undefined) {
      return [
        {
          filename: filename ? `${filename}.${language}` : `index.${language}`,
          code,
          language,
          panelClassName,
          paneStyle,
          highlightLines,
          highlightClassName,
          showLineNumbers,
        },
      ];
    }

    return [];
  }, [
    files,
    code,
    language,
    filename,
    panelClassName,
    paneStyle,
    highlightLines,
    highlightClassName,
    showLineNumbers,
  ]);

  const isMulti = normalizedFiles.length > 1;
  const [activeTab, setActiveTab] = React.useState(
    normalizedFiles[0]?.filename ?? "",
  );

  // Keep activeTab in sync if files list changes
  React.useEffect(() => {
    if (
      normalizedFiles.length > 0 &&
      !normalizedFiles.some((f) => f.filename === activeTab)
    ) {
      setActiveTab(normalizedFiles[0].filename);
    }
  }, [normalizedFiles, activeTab]);

  const activeFile =
    normalizedFiles.find((f) => f.filename === activeTab) ?? normalizedFiles[0];

  if (normalizedFiles.length === 0) return null;

  return (
    <div
      data-slot="code-block"
      className={cn(
        "bg-muted/50 border-border overflow-hidden rounded-xl border text-sm",
        className,
      )}
      {...props}
    >
      {/* Header */}
      <div
        data-slot="code-block-header"
        className="border-border flex items-center justify-between gap-2 border-b"
      >
        {isMulti ? (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1"
          >
            <TabsList className="group-data-horizontal/tabs:h-auto">
              {normalizedFiles.map((file) => (
                <TabsTrigger
                  key={file.filename}
                  value={file.filename}
                  className="h-auto px-3 py-2 text-xs font-medium"
                >
                  {file.filename}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        ) : (
          <span
            data-slot="code-block-filename"
            className="text-muted-foreground px-3 py-2 text-xs font-medium"
          >
            {normalizedFiles[0].filename}
          </span>
        )}

        {activeFile && (
          <CodeBlockCopyButton
            code={activeFile.code}
            className="mr-1 shrink-0"
          />
        )}
      </div>

      {/* Code pane – no copy button inside since header already has one */}
      {activeFile && (
        <CodeBlockPane
          key={activeFile.filename}
          code={activeFile.code}
          language={activeFile.language}
          showCopy={false}
          className={activeFile.panelClassName}
          style={activeFile.paneStyle}
          highlightLines={activeFile.highlightLines}
          highlightClassName={activeFile.highlightClassName}
          showLineNumbers={activeFile.showLineNumbers}
        />
      )}
    </div>
  );
}

export { CodeBlock, CodeBlockPane, CodeBlockCopyButton };
