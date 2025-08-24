import React, { useState } from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import axios from "axios";
import { createChatBotMessage } from "react-chatbot-kit";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import "./SpendWiseBot.css";

// --- Action Provider ---
const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const { user } = useContext(UserContext);

  const handleUserMessage = async (message) => {
    try {
      // Enhanced prompt with user context
      const enhancedPrompt = `
        User Context:
        - Name: ${user?.firstName || 'User'}
        - This is a personal finance question from a user of our expense tracking app.
        
        User Question: ${message}
        
        Please provide personalized financial advice considering:
        1. This user is actively tracking their expenses
        2. Provide practical, actionable tips
        3. Be encouraging and supportive
        4. If asking about savings goals, suggest specific amounts or percentages
        5. Include tips relevant to Indian financial context when appropriate
      `;

      const res = await axios.post("https://spenttracker-backend.onrender.com/api/v1/ask-ai", { 
        prompt: enhancedPrompt 
      });
      const botMessage = createChatBotMessage(res.data.response);

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, botMessage],
      }));
    } catch (error) {
      const errorMessage = createChatBotMessage("⚠️ Oops! I'm having trouble right now.");
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
      }));
    }
  };

  return React.Children.map(children, (child) =>
    React.cloneElement(child, {
      actions: { handleUserMessage },
    })
  );
};

// --- Message Parser ---
const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    actions.handleUserMessage(message);
  };

  return React.Children.map(children, (child) =>
    React.cloneElement(child, {
      parse,
      actions,
    })
  );
};

// --- Config ---
const config = {
  initialMessages: [
    createChatBotMessage("👋 Hi! I'm SpendWise Bot. I can help you with personalized financial advice, budgeting tips, and savings goals. What would you like to know?")
  ],
  botName: "SpendWise Bot",
};

const SpendWiseBot = () => {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Floating Button */}
      <button className="chat-toggle-btn" onClick={() => setOpen(!open)}>
        {open ? "✖" : "💬"}
      </button>

      {/* Chatbot Window */}
      {open && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <span>💰 SpendWise Bot {user?.firstName ? `- Hi ${user.firstName}!` : ''}</span>
            <button className="close-btn" onClick={() => setOpen(false)}>✖</button>
          </div>
          <div className="chatbot-body">
            <Chatbot
              config={config}
              messageParser={MessageParser}
              actionProvider={(props) => <ActionProvider {...props} />}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SpendWiseBot;
