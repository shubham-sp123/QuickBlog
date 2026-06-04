import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets, blog_data, comments_data } from "../assets/assets";
import Navbar from "../components/Navbar";
import Moment from "moment";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { useRef } from "react";

function Blog() {
  const { id } = useParams();

  const { axios, user } = useAppContext();

  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);

  const [name, setName] = useState(user?.name || "");

  const [content, setContent] = useState("");

  // --- Summary state ---
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I've read this article. Ask me anything about it!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  const fetchBlogData = async () => {
    try {
      const { data } = await axios.get(`/api/blog/${id}`);
      data.success ? setData(data.blog) : toast.error(data.message);
     
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await axios.post("/api/blog/comments", { blogId: id });
      if (data.success) {
        setComments(data.comments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/blog/add-comment", {
        blog: id,
        name,
        content,
      });
      if (data.success) {
        toast.success(data.message);
        setName("");
        setContent("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSummarize = async () => {
    setSummaryLoading(true);
    setSummaryError("");
    setSummary("");
    try {
      const { data } = await axios.post("/api/blog/summarize", { blogId: id });
      if (data.success) {
        setSummary(data.content);
      } else {
        setSummaryError(data.message || "Failed to generate summary.");
      }
    } catch (error) {
      setSummaryError(error.message || "Something went wrong.");
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleChatSend = async () => {
    const question = chatInput.trim();
    if (!question || chatLoading) return;

    const userMessage = { role: "user", text: question };
    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    setChatInput("");
    setChatLoading(true);

    try {
      const { data } = await axios.post("/api/blog/chat", {
        blogId: id,
        question,
        // send history excluding the initial greeting
        history: updatedMessages.slice(1),
      });

      if (data.success) {
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", text: data.content },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "Sorry, I couldn't process that. Please try again.",
            isError: true,
          },
        ]);
      }
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Network error. Please try again.",
          isError: true,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleChatKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChatSend();
    }
  };

  // Auto-scroll chat to bottom on new message
  useEffect(() => {
    if (chatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, chatOpen]);

  useEffect(() => {
    fetchBlogData();
    fetchComments();
  }, []);

  return data ? (
    <div className="relative">
      <img
        src={assets.gradientBackground}
        alt=""
        className="absolute -top-50 -z-1 opacity-50"
      />
      <Navbar />

      <div className="text-center mt-20 text-gray-600">
        <p className="text-primary py-4 font-medium">
          Published on {Moment(data.createdAt).format("MMMM Do YYYY")}
        </p>
        <h1 className="text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800">
          {data.title}
        </h1>
        <h2 className="my-5 max-w-lg truncate mx-auto">{data.subTitle}</h2>
        <p className="inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary">
          {data.authorName}
        </p>
      </div>

      <div className="mx-5 max-w-5xl md:mx-auto my-10 mt-6">
        <img className="rounded-3xl mb-5" src={data.image} alt="" />

        {/* ── AI Summary Section ── */}
        <div className="max-w-3xl mx-auto my-8 p-5 border border-primary/20 rounded-2xl bg-primary/3">
          <div className="flex items-center gap-2 mb-3">
            {/* Spark icon */}
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <p className="font-semibold text-gray-700">AI Summary</p>
          </div>

          {/* State 1 — has summary */}
          {summary && (
            <div className="text-gray-600 text-sm leading-relaxed">
              <p>{summary}</p>
              <button
                onClick={() => {
                  setSummary("");
                  setSummaryError("");
                }}
                className="mt-3 text-xs text-primary underline cursor-pointer"
              >
                Clear summary
              </button>
            </div>
          )}

          {/* State 2 — loading */}
          {summaryLoading && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="animate-spin inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></span>
              Generating summary…
            </div>
          )}

          {/* State 3 — error */}
          {summaryError && !summaryLoading && (
            <div className="text-sm text-red-500">
              <p>⚠ {summaryError}</p>
              <button
                onClick={handleSummarize}
                className="mt-2 text-xs text-primary underline cursor-pointer"
              >
                Try again
              </button>
            </div>
          )}

          {/* State 4 — idle (no summary yet) */}
          {!summary && !summaryLoading && !summaryError && (
            <div>
              <p className="text-sm text-gray-500 mb-3">
                Get a quick AI-generated overview of this article.
              </p>
              <button
                onClick={handleSummarize}
                className="flex items-center gap-2 bg-primary text-white text-sm py-2 px-5 rounded-full hover:opacity-90 transition-all cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Summarize with AI
              </button>
            </div>
          )}
        </div>

        <div
          className="rich-text max-w-3xl mx-auto my-10 mt-6"
          dangerouslySetInnerHTML={{ __html: data.description }}
        ></div>
        {/* Comments Section */}
        <div className="mt-14 mb-10 max-w-3xl mx-auto">
          <p className="font-semibold mb-4">Comments ({comments.length})</p>
          <div className="flex flex-col gap-4">
            {comments.map((item, index) => (
              <div
                className="relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600"
                key={index}
              >
                <div className="flex items-center gap-2 mb-2">
                  <img src={assets.user_icon} alt="" className="w-6" />
                  <p className="font-medium">{item.name}</p>
                </div>
                <p className="text-sm max-w-md ml-8">{item.content}</p>
                <div className="absolute right-4 bottom-3 flex items-center gap-2 text-xs">
                  {Moment(item.createdAt).fromNow()}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Add Comment Section */}
        <div className="max-w-3xl mx-auto">
          <p className="font-semibold mb-4">Add your comment</p>
          <form
            className="flex flex-col items-start gap-4 max-w-lg"
            onSubmit={addComment}
          >
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Name"
              required
              readOnly={!!user}
              className={`w-full p-2 border border-gray-300 rounded outline-none ${user ? "bg-gray-50 text-gray-400" : ""}`}
            />
            <textarea
              onChange={(e) => setContent(e.target.value)}
              value={content}
              placeholder="comment"
              className="w-full p-2 border border-gray-300 rounded outline-none h-48"
            ></textarea>
            <button
              className="bg-primary text-white rounded p-2 px-8 hover:scale-102 transition-all cursor-pointer"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Share Buttons */}

        <div className="my-24 max-w-3xl mx-auto">
          <p className="font-semibold my-4">
            Share this article on social media
          </p>
          <div className="flex items-center gap-3">
            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on Facebook"
            >
              <img
                src={assets.facebook_icon}
                width={50}
                alt="Facebook"
                className="hover:scale-110 transition-all cursor-pointer"
              />
            </a>

            {/* Twitter / X */}
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(data.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on Twitter"
            >
              <img
                src={assets.twitter_icon}
                width={50}
                alt="Twitter"
                className="hover:scale-110 transition-all cursor-pointer"
              />
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(data.title + " " + window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on WhatsApp"
            >
              <img
                src={assets.googleplus_icon}
                width={50}
                alt="WhatsApp"
                className="hover:scale-110 transition-all cursor-pointer"
              />
            </a>

            {/* Copy Link */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
              }}
              title="Copy link"
              className="flex items-center gap-2 border border-gray-300 text-gray-500 text-sm px-4 py-2 rounded-full hover:bg-gray-50 hover:scale-105 transition-all cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy Link
            </button>
          </div>
        </div>
      </div>
      <Footer />
      {/* ── Floating Chat Toggle Button ── */}
      <button
        onClick={() => setChatOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary text-white px-4 py-3 rounded-full shadow-lg hover:opacity-90 transition-all cursor-pointer"
        aria-label="Toggle blog chat"
      >
        {chatOpen ? (
          // X icon
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          // Chat bubble icon
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M21 16c0 1.1-.9 2-2 2H7l-4 4V6a2 2 0 012-2h14a2 2 0 012 2v10z"
            />
          </svg>
        )}
        <span className="text-sm font-medium">
          {chatOpen ? "Close" : "Ask AI"}
        </span>
      </button>

      {/* ── Chat Panel ── */}
      <div
        className={`fixed bottom-20 right-6 z-50 w-80 sm:w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out ${
          chatOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-6 pointer-events-none"
        }`}
        style={{ height: "520px" }}
      >
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-primary/5 rounded-t-2xl">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 text-sm">
              Blog Assistant
            </p>
            <p className="text-xs text-gray-500 truncate">
              Ask anything about this article
            </p>
          </div>
          {/* Clear chat */}
          <button
            onClick={() =>
              setChatMessages([
                {
                  role: "assistant",
                  text: "Hi! I've read this article. Ask me anything about it!",
                },
              ])
            }
            className="ml-auto text-xs text-gray-400 hover:text-primary transition-colors cursor-pointer flex-shrink-0"
            title="Clear chat"
          >
            Clear
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 scroll-smooth">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {/* Avatar for assistant */}
              {msg.role === "assistant" && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              )}

              <div
                className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-br-sm"
                    : msg.isError
                      ? "bg-red-50 text-red-500 border border-red-100 rounded-bl-sm"
                      : "bg-gray-100 text-gray-700 rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>

              {/* Avatar for user */}
              {msg.role === "user" && (
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-3 h-3 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {chatLoading && (
            <div className="flex gap-2 justify-start">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
                <span
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></span>
                <span
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></span>
                <span
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-3 py-3 border-t border-gray-100">
          <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleChatKeyDown}
              placeholder="Ask about this article…"
              rows={1}
              className="flex-1 bg-transparent text-sm text-gray-700 outline-none resize-none max-h-24 leading-relaxed placeholder-gray-400"
              style={{ minHeight: "24px" }}
            />
            <button
              onClick={handleChatSend}
              disabled={!chatInput.trim() || chatLoading}
              className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                chatInput.trim() && !chatLoading
                  ? "bg-primary hover:opacity-90"
                  : "bg-gray-200 cursor-not-allowed"
              }`}
            >
              <svg
                className={`w-4 h-4 ${chatInput.trim() && !chatLoading ? "text-white" : "text-gray-400"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  ) : (
    <Loader />
  );
}

export default Blog;
