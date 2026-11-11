
/* eslint-disable react/prop-types */
import { useEffect, useRef, useCallback } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { MdFormatBold, MdFormatItalic } from "react-icons/md";
import { GrUnderline } from "react-icons/gr";
import { MdStrikethroughS } from "react-icons/md";
import {
  MdFormatListBulleted,
  MdFormatListNumbered,
} from "react-icons/md";
import {
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
  MdFormatAlignJustify,
} from "react-icons/md";
import { MdLink } from "react-icons/md";

const RichTextEditor = ({ onChange, value = "" }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const onChangeRef = useRef(onChange);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Initialize Quill only once
  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    const quill = new Quill(editorRef.current, {
      theme: "snow",
      modules: {
        toolbar: false,
      },
      placeholder: "Add additional details about your event...",
    });

    quillRef.current = quill;

   quill.on("text-change", () => {
  if (isUpdatingRef.current) return;

  const text = quill.getText().trim();
  onChangeRef.current?.(text);
});

    return () => {
      quill.off("text-change");
      quillRef.current = null;
    };
  }, []);

  // Sync external value without reinitializing Quill
  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;

    const currentValue = quill.getContents();

    if (!value) {
      if (quill.getText().trim()) {
        isUpdatingRef.current = true;
        quill.setText("");
        isUpdatingRef.current = false;
      }
      return;
    }

    try {
      const parsedValue = JSON.parse(value);

      if (
        JSON.stringify(currentValue) !== JSON.stringify(parsedValue)
      ) {
        isUpdatingRef.current = true;
        quill.setContents(parsedValue);
        isUpdatingRef.current = false;
      }
    } catch {
      // Ignore invalid external values
    }
  }, [value]);

  const applyFormat = (format, formatValue = true) => {
    const quill = quillRef.current;
    if (!quill) return;

    const range = quill.getSelection();
    if (range) {
      if (range.length > 0) {
        quill.formatText(
          range.index,
          range.length,
          format,
          formatValue
        );
      } else {
        quill.format(format, formatValue);
      }
    }
    quill.focus();
  };

  const insertLink = () => {
    const quill = quillRef.current;
    if (!quill) return;

    const range = quill.getSelection();
    if (!range || !range.length) return;

    const url = prompt("Enter URL:");

    if (url) {
      quill.formatText(range.index, range.length, "link", url);
    }

    quill.focus();
  };

  const formatList = (type) => {
    const quill = quillRef.current;
    if (!quill) return;

    const range = quill.getSelection();
    if (!range) return;

    quill.formatLine(
      range.index,
      range.length,
      "list",
      type
    );
    quill.focus();
  };

  const formatAlignment = (align) => {
    const quill = quillRef.current;
    if (!quill) return;

    const range = quill.getSelection();
    if (!range) return;

    quill.formatLine(
      range.index,
      range.length,
      "align",
      align
    );
    quill.focus();
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[16px] font-bold text-[#333333] mb-2">
          Additional Information (Optional)
        </h3>
        <p className="text-[13px] text-[#666666] mb-4">
          Provide additional details about your event. The message will appear
          next to your invitation.
        </p>
      </div>

      <div className="bg-[#E8E8E8] rounded-t-lg p-3 flex items-center gap-2 flex-wrap">
        <button type="button" onClick={() => applyFormat("bold")} className="p-2 hover:bg-[#D0D0D0] rounded" title="Bold">
          <MdFormatBold className="text-[18px] text-[#333333]" />
        </button>

        <button type="button" onClick={() => applyFormat("italic")} className="p-2 hover:bg-[#D0D0D0] rounded" title="Italic">
          <MdFormatItalic className="text-[18px] text-[#333333]" />
        </button>

        <button type="button" onClick={() => applyFormat("underline")} className="p-2 hover:bg-[#D0D0D0] rounded" title="Underline">
          <GrUnderline className="text-[16px] text-[#333333]" />
        </button>

        <button type="button" onClick={() => applyFormat("strike")} className="p-2 hover:bg-[#D0D0D0] rounded" title="Strikethrough">
          <MdStrikethroughS className="text-[18px] text-[#333333]" />
        </button>

        <div className="h-6 w-px bg-[#CCCCCC] mx-1" />

        <button type="button" onClick={() => formatList("bullet")} className="p-2 hover:bg-[#D0D0D0] rounded" title="Bullet List">
          <MdFormatListBulleted className="text-[18px] text-[#333333]" />
        </button>

        <button type="button" onClick={() => formatList("ordered")} className="p-2 hover:bg-[#D0D0D0] rounded" title="Ordered List">
          <MdFormatListNumbered className="text-[18px] text-[#333333]" />
        </button>

        <div className="h-6 w-px bg-[#CCCCCC] mx-1" />

        <button type="button" onClick={() => formatAlignment("left")} className="p-2 hover:bg-[#D0D0D0] rounded" title="Align Left">
          <MdFormatAlignLeft className="text-[18px] text-[#333333]" />
        </button>

        <button type="button" onClick={() => formatAlignment("center")} className="p-2 hover:bg-[#D0D0D0] rounded" title="Align Center">
          <MdFormatAlignCenter className="text-[18px] text-[#333333]" />
        </button>

        <button type="button" onClick={() => formatAlignment("right")} className="p-2 hover:bg-[#D0D0D0] rounded" title="Align Right">
          <MdFormatAlignRight className="text-[18px] text-[#333333]" />
        </button>

        <button type="button" onClick={() => formatAlignment("justify")} className="p-2 hover:bg-[#D0D0D0] rounded" title="Justify">
          <MdFormatAlignJustify className="text-[18px] text-[#333333]" />
        </button>

        <div className="h-6 w-px bg-[#CCCCCC] mx-1" />

        <button type="button" onClick={insertLink} className="p-2 hover:bg-[#D0D0D0] rounded" title="Insert Link">
          <MdLink className="text-[18px] text-[#333333]" />
        </button>
      </div>

      <div
        ref={editorRef}
        className="bg-white border-2 border-t-0 border-[#E8E8E8] rounded-b-lg p-4 min-h-[300px]"
        style={{
          fontSize: "14px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      />
    </div>
  );
};

export default RichTextEditor;
