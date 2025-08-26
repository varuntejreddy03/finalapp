import React, { useState, useContext, useEffect } from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import axios from "axios";
import { createChatBotMessage } from "react-chatbot-kit";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import "./SpendWiseBot.css";

// Enhanced Action Provider with more sophisticated features
const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const { user } = useContext(UserContext);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [userContext, setUserContext] = useState({});

  // Fetch user financial context
  useEffect(() => {
    fetchUserContext();
  }, []);

  const fetchUserContext = async () => {
    try {
      const [incomeResponse, expenseResponse] = await Promise.all([
        axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME),
        axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSES)
      ]);

      const incomeData = incomeResponse.data?.incomes || incomeResponse.data?.data || [];
      const expenseData = expenseResponse.data?.expenses || expenseResponse.data?.data || [];

      const totalIncome = incomeData.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
      const totalExpenses = expenseData.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

      // Calculate spending patterns
      const categorySpending = expenseData.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {});

      const topSpendingCategory = Object.entries(categorySpending)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown';

      setUserContext({
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0,
        topSpendingCategory,
        transactionCount: incomeData.length + expenseData.length,
        categorySpending
      });
    } catch (error) {
      console.error('Failed to fetch user context:', error);
    }
  };

  // Enhanced message handling with context awareness
  const handleUserMessage = async (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Add to conversation history
    setConversationHistory(prev => [...prev, { type: 'user', message, timestamp: new Date() }]);

    try {
      // Check for specific commands first
      if (lowerMessage.includes('budget') || lowerMessage.includes('spending')) {
        handleBudgetInquiry(message);
        return;
      }

      if (lowerMessage.includes('save') || lowerMessage.includes('saving')) {
        handleSavingsAdvice(message);
        return;
      }

      if (lowerMessage.includes('expense') || lowerMessage.includes('spend')) {
        handleExpenseAnalysis(message);
        return;
      }

      if (lowerMessage.includes('income') || lowerMessage.includes('earn')) {
        handleIncomeAdvice(message);
        return;
      }

      if (lowerMessage.includes('goal') || lowerMessage.includes('target')) {
        handleGoalSetting(message);
        return;
      }

      // Enhanced AI prompt with comprehensive context
      const enhancedPrompt = `
        User Context:
        - Name: ${user?.firstName || 'User'}
        - Total Income: ₹${userContext.totalIncome?.toLocaleString() || '0'}
        - Total Expenses: ₹${userContext.totalExpenses?.toLocaleString() || '0'}
        - Current Balance: ₹${userContext.balance?.toLocaleString() || '0'}
        - Savings Rate: ${userContext.savingsRate?.toFixed(1) || '0'}%
        - Top Spending Category: ${userContext.topSpendingCategory || 'Unknown'}
        - Total Transactions: ${userContext.transactionCount || 0}
        
        Conversation History: ${conversationHistory.slice(-3).map(h => `${h.type}: ${h.message}`).join(', ')}
        
        User Question: ${message}
        
        Please provide personalized financial advice considering:
        1. The user's current financial situation shown above
        2. Provide specific, actionable recommendations
        3. Be encouraging and supportive
        4. Include relevant numbers and percentages when helpful
        5. Consider Indian financial context and practices
        6. If the user's savings rate is low, provide specific tips to improve it
        7. Reference their spending patterns when relevant
      `;

      const res = await axios.post("https://spenttracker-backend.onrender.com/api/v1/ask-ai", { 
        prompt: enhancedPrompt 
      });
      
      const botMessage = createChatBotMessage(res.data.response);
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, botMessage],
      }));

      // Save conversation to history
      setConversationHistory(prev => [...prev, { 
        type: 'bot', 
        message: res.data.response, 
        timestamp: new Date() 
      }]);

    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = createChatBotMessage("⚠️ I'm having trouble connecting right now. Please try again in a moment!");
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
      }));
    }
  };

  // Specialized handlers for different types of inquiries
  const handleBudgetInquiry = (message) => {
    const { totalIncome, totalExpenses, categorySpending } = userContext;
    
    let response = `📊 **Budget Analysis for ${user?.firstName}:**\n\n`;
    response += `💰 Monthly Income: ₹${totalIncome?.toLocaleString() || '0'}\n`;
    response += `💸 Monthly Expenses: ₹${totalExpenses?.toLocaleString() || '0'}\n`;
    response += `💵 Remaining: ₹${(totalIncome - totalExpenses)?.toLocaleString() || '0'}\n\n`;
    
    if (categorySpending && Object.keys(categorySpending).length > 0) {
      response += `**Top Spending Categories:**\n`;
      Object.entries(categorySpending)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .forEach(([category, amount], index) => {
          response += `${index + 1}. ${category}: ₹${amount.toLocaleString()}\n`;
        });
    }
    
    response += `\n💡 **Recommendations:**\n`;
    if (totalExpenses > totalIncome * 0.8) {
      response += `• Your expenses are quite high (${((totalExpenses/totalIncome)*100).toFixed(1)}% of income)\n`;
      response += `• Consider reducing spending in ${userContext.topSpendingCategory}\n`;
    } else {
      response += `• Great job! You're spending ${((totalExpenses/totalIncome)*100).toFixed(1)}% of your income\n`;
      response += `• Consider investing the surplus for better returns\n`;
    }

    const botMessage = createChatBotMessage(response);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleSavingsAdvice = (message) => {
    const { savingsRate, totalIncome, totalExpenses } = userContext;
    
    let response = `💰 **Savings Analysis:**\n\n`;
    response += `Current Savings Rate: ${savingsRate?.toFixed(1) || '0'}%\n`;
    response += `Monthly Savings: ₹${(totalIncome - totalExpenses)?.toLocaleString() || '0'}\n\n`;
    
    if (savingsRate < 20) {
      response += `🎯 **Goal:** Aim for 20% savings rate\n`;
      response += `📈 **To achieve this, you need to save:** ₹${((totalIncome * 0.2) - (totalIncome - totalExpenses))?.toLocaleString() || '0'} more per month\n\n`;
      response += `💡 **Quick Tips:**\n`;
      response += `• Try the 50/30/20 rule (50% needs, 30% wants, 20% savings)\n`;
      response += `• Reduce spending in ${userContext.topSpendingCategory} by 10%\n`;
      response += `• Set up automatic transfers to savings account\n`;
    } else {
      response += `🎉 Excellent! You're saving ${savingsRate.toFixed(1)}% of your income\n`;
      response += `💡 **Next Steps:**\n`;
      response += `• Consider investing in mutual funds or SIPs\n`;
      response += `• Build an emergency fund (6 months expenses)\n`;
      response += `• Explore tax-saving investments under 80C\n`;
    }

    const botMessage = createChatBotMessage(response);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleExpenseAnalysis = (message) => {
    const { categorySpending, totalExpenses } = userContext;
    
    let response = `📊 **Expense Analysis:**\n\n`;
    response += `Total Monthly Expenses: ₹${totalExpenses?.toLocaleString() || '0'}\n\n`;
    
    if (categorySpending && Object.keys(categorySpending).length > 0) {
      response += `**Breakdown by Category:**\n`;
      Object.entries(categorySpending)
        .sort(([,a], [,b]) => b - a)
        .forEach(([category, amount]) => {
          const percentage = ((amount / totalExpenses) * 100).toFixed(1);
          response += `• ${category}: ₹${amount.toLocaleString()} (${percentage}%)\n`;
        });
      
      response += `\n💡 **Optimization Tips:**\n`;
      const topCategory = Object.entries(categorySpending).sort(([,a], [,b]) => b - a)[0];
      if (topCategory) {
        response += `• Your highest expense is ${topCategory[0]} (₹${topCategory[1].toLocaleString()})\n`;
        response += `• Try to reduce this by 10-15% next month\n`;
      }
    }
    
    response += `• Track daily expenses to identify patterns\n`;
    response += `• Use the 24-hour rule for non-essential purchases\n`;

    const botMessage = createChatBotMessage(response);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleIncomeAdvice = (message) => {
    const { totalIncome } = userContext;
    
    let response = `💼 **Income Enhancement Tips:**\n\n`;
    response += `Current Monthly Income: ₹${totalIncome?.toLocaleString() || '0'}\n\n`;
    
    response += `🚀 **Ways to Increase Income:**\n`;
    response += `• Freelancing in your spare time\n`;
    response += `• Skill development for promotions\n`;
    response += `• Side business or consulting\n`;
    response += `• Passive income through investments\n`;
    response += `• Rent out unused space/assets\n\n`;
    
    response += `📈 **Investment Options:**\n`;
    response += `• SIP in mutual funds\n`;
    response += `• Fixed deposits for stable returns\n`;
    response += `• PPF for tax benefits\n`;
    response += `• Stock market (with proper research)\n`;

    const botMessage = createChatBotMessage(response);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleGoalSetting = (message) => {
    const { totalIncome, balance } = userContext;
    
    let response = `🎯 **Financial Goal Setting:**\n\n`;
    response += `Based on your current income of ₹${totalIncome?.toLocaleString() || '0'}:\n\n`;
    
    response += `**Short-term Goals (1-2 years):**\n`;
    response += `• Emergency Fund: ₹${(totalIncome * 6)?.toLocaleString() || '0'} (6 months expenses)\n`;
    response += `• Vacation Fund: ₹${(totalIncome * 0.5)?.toLocaleString() || '0'}\n`;
    response += `• Gadget/Electronics: ₹${(totalIncome * 0.3)?.toLocaleString() || '0'}\n\n`;
    
    response += `**Medium-term Goals (3-5 years):**\n`;
    response += `• Car Down Payment: ₹${(totalIncome * 3)?.toLocaleString() || '0'}\n`;
    response += `• Home Down Payment: ₹${(totalIncome * 12)?.toLocaleString() || '0'}\n`;
    response += `• Education/Certification: ₹${(totalIncome * 2)?.toLocaleString() || '0'}\n\n`;
    
    response += `**Long-term Goals (5+ years):**\n`;
    response += `• Retirement Fund: Start with ₹${(totalIncome * 0.1)?.toLocaleString() || '0'}/month\n`;
    response += `• Child's Education: ₹${(totalIncome * 8)?.toLocaleString() || '0'}\n\n`;
    
    response += `💡 **Goal Achievement Tips:**\n`;
    response += `• Use the SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound)\n`;
    response += `• Automate savings for each goal\n`;
    response += `• Review and adjust quarterly\n`;

    const botMessage = createChatBotMessage(response);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  return React.Children.map(children, (child) =>
    React.cloneElement(child, {
      actions: { handleUserMessage },
    })
  );
};

// Enhanced Message Parser
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

// Enhanced Config with better initial messages
const config = {
  initialMessages: [
    createChatBotMessage("👋 Hi! I'm SpendWise Bot, your personal financial advisor!"),
    createChatBotMessage("I can help you with:\n💰 Budget analysis\n📊 Expense tracking\n🎯 Savings goals\n📈 Investment advice\n💡 Financial tips\n\nWhat would you like to know?")
  ],
  botName: "SpendWise Bot",
};

const SpendWiseBot = () => {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  // Show notification for new users
  useEffect(() => {
    const hasSeenBot = localStorage.getItem('hasSeenSpendWiseBot');
    if (!hasSeenBot && user) {
      setHasNewMessage(true);
      setTimeout(() => {
        setHasNewMessage(false);
        localStorage.setItem('hasSeenSpendWiseBot', 'true');
      }, 5000);
    }
  }, [user]);

  const toggleChat = () => {
    setOpen(!open);
    setHasNewMessage(false);
  };

  return (
    <div>
      {/* Floating Button with notification */}
      <button 
        className={`chat-toggle-btn ${hasNewMessage ? 'animate-bounce' : ''}`} 
        onClick={toggleChat}
      >
        {open ? "✖" : "💬"}
        {hasNewMessage && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </button>

      {/* Enhanced Chatbot Window */}
      {open && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <div className="bot-title">
              <span>🤖</span>
              <span>SpendWise Bot</span>
              {user?.firstName && (
                <span className="text-xs opacity-75">- Hi {user.firstName}!</span>
              )}
            </div>
            <button className="close-btn" onClick={toggleChat}>✖</button>
          </div>
          
          <div className="chatbot-body">
            <Chatbot
              config={config}
              messageParser={MessageParser}
              actionProvider={(props) => <ActionProvider {...props} />}
            />
          </div>
          
          {/* Quick Action Buttons */}
          <div className="p-2 border-t bg-gray-50 flex gap-2 flex-wrap">
            <button 
              className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full hover:bg-purple-200"
              onClick={() => {
                const input = document.querySelector('.react-chatbot-kit-chat-input');
                if (input) {
                  input.value = 'Show my budget analysis';
                  input.focus();
                }
              }}
            >
              📊 Budget
            </button>
            <button 
              className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full hover:bg-green-200"
              onClick={() => {
                const input = document.querySelector('.react-chatbot-kit-chat-input');
                if (input) {
                  input.value = 'How can I save more money?';
                  input.focus();
                }
              }}
            >
              💰 Savings
            </button>
            <button 
              className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full hover:bg-blue-200"
              onClick={() => {
                const input = document.querySelector('.react-chatbot-kit-chat-input');
                if (input) {
                  input.value = 'Help me set financial goals';
                  input.focus();
                }
              }}
            >
              🎯 Goals
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpendWiseBot;