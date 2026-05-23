import { useState, useEffect, useCallback} from 'react'
import './App.css'
function App() {
  let firstWidth = 180; 
  let minWidth = 150;
  let maxWidth = 600;
  const [sidebarWidth, setSidebarWidth] = useState(firstWidth); 
  const [isResizing, setIsResizing] = useState(false);
  const [messages, setMessages] = useState([]);//storage for messages
  const [input, setInput] = useState("");
// start sidebar resizing
  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);
// stop sidebar resizing
  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);
// sidebar resizing(follow mouse movement but only when isResizing is true)
  const resize = useCallback(
    (e) => {
      if (isResizing) {
        const newWidth = e.clientX;
        if (newWidth > minWidth && newWidth < maxWidth) {
          setSidebarWidth(newWidth);
        }
      }
    },
    [isResizing]
  );
// add event listeners for mousemove and mouseup to handle resizing
  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  // handle send message: send new message to the backend and update the list if successful
  const handleSendMessage = async() => {
    if(input.trim() === ""){
      console.log("メッセージが空です。送信できません。");
      return;
    }
    const postRequest = {
       content: input 
      }; 
    const url = 'http://localhost:8082/api/v1/posts'; 
    try{
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postRequest)
    });
    if(response.ok){
      setMessages([...messages, input]);
      setInput("");
      console.log("successfully sent message: " + input);
    }else{
      console.error("Failed to send message. Status: " + response.status);
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
  };

  return (
    <div className="container">
      <aside className="sidebar" style={{ width: sidebarWidth }}>
        <div className="sidebar-header">
          <h1>グループ一覧</h1>
          <button>会員登録</button>
          <button>グループ作成</button>
        </div>
        <ul className="group-list">
          <li>研究プロジェクト</li>
          <li>サークル連絡</li>
          <li>ShareEX 開発</li>
        </ul>
      </aside>
      <div className="resizer" onMouseDown={startResizing} />
      <main className="main-content">
        <header className="header">
          <h2 className="appTitle">ShareEX</h2>
          <button>秘密投稿</button>
          <textarea className="searchInput" placeholder="グループ内での検索"></textarea>
        </header>
        <div className="messageList">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              {msg}
            </div>
          ))}
        </div>
  
        <footer className="footer">
          <div><textarea
           className="messageInput"
           placeholder="#メッセージを入力"
           value={input}
           onChange={(e) => setInput(e.target.value)}
           ></textarea></div>
          <div><button onClick={handleSendMessage}>送信</button></div>
        </footer>
        </main>
    </div>
  
  )
}

export default App