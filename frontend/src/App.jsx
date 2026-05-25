import { useState, useEffect, useCallback} from 'react'
import './App.css'
function App() {
  let firstWidth = 180; 
  let minWidth = 150;
  let maxWidth = 600;
  const [sidebarWidth, setSidebarWidth] = useState(firstWidth); 
  const [isResizing, setIsResizing] = useState(false);
  const [messages, setMessages] = useState([]);//storage for messages
  const [input, setInput] = useState("")
  //認証関連
  const [currentUser, setCurrentUser] = useState(null);
  //新規登録
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regError, setRegError] = useState("");
  const [regEmailConfirm, setRegEmailConfirm] = useState("");
  // ログイン
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:8082/api/v1/posts');
        if (response.ok) {
          const data = await response.json();
          setMessages(data); 
        } 
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    useEffect(() => {
      fetchMessages();
      const interval = setInterval(()=>{fetchMessages();}, 2000); // 2秒ごとにメッセージを更新
      return () => clearInterval(interval); // クリーンアップ
    }, []);
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
    [isResizing, minWidth, maxWidth]
  );
// add event listeners for mousemove and mouseup to handle resizing
  useEffect(() => {
    fetchMessages();
    
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
    if(!currentUser){
      alert("メッセージを送信するにはログインしてください。");//ゲスト投稿もいつかできるようにするかも
      return;
    }
    const postRequest = {
       content: input ,
       userId: currentUser.id
      }; 
    const url = 'http://localhost:8082/api/v1/posts'; 
    try{
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postRequest)
    });
    if(response.ok){
      setInput("");
      fetchMessages(); // 送信後にメッセージを更新
      console.log("successfully sent message: " + input);
    }else{
      console.error("Failed to send message. Status: " + response.status);
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError("");
    if(!regEmail.includes("@")){
      setRegError("有効なメールアドレスを入力してください。@が必要です。");
      return;
    }
    if(regEmail !== regEmailConfirm){
      setRegError("メールアドレスが一致しません。");
      return;
    }
    try{
      const response = await fetch('http://localhost:8082/api/v1/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: regUsername,
          email: regEmail,
          password: regPassword
        })
      });
      if(response.ok){
        alert("会員登録が完了しました");
        setIsRegisterOpen(false);
        setRegUsername("");
        setRegEmail("");
        setRegPassword("");
      }else{
        const errorText = await response.text();
        setRegError(errorText);
      }
    } catch (error) {
      setRegError("サーバーとの通信に失敗しました。");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await fetch('http://localhost:8082/api/v1/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      });

      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData); 
        setIsLoginOpen(false);
        setLoginEmail("");
        setLoginPassword("");
        alert(`${userData.username}さん、ようこそ！`);
      } else {
        const errorText = await response.text();
        setLoginError(errorText);
      }
    } catch (error) {
      setLoginError("サーバーとの通信に失敗しました。");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null); 
    alert("ログアウトしました。");
  };
  return (
    <div className="container">
      <aside className="sidebar" style={{ width: sidebarWidth }}>
        <div className="sidebar-header">
          <h1>グループ一覧</h1>
          {currentUser ? (
            <div className="user-profile">
              <p>👤 {currentUser.username}</p>
              <button onClick={handleLogout}>ログアウト</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button onClick={() => setIsRegisterOpen(true)}>会員登録</button>
              <button onClick={() => setIsLoginOpen(true)}>ログイン</button>
            </div>
          )}
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
          <h2 className="appTitle">SecureChat</h2>
          <button>秘密投稿</button>
          <textarea className="searchInput" placeholder="グループ内での検索"></textarea>
        </header>
        <div className="messageList">
          {messages.map((msg, index) => (
            <div key={msg.id || index} className="message">
              <span style={{ fontWeight: 'bold', marginRight: '10px' }}>
                {msg.user ? msg.user.username : "不明なユーザー"}
              </span>
              {msg.content}
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
      {isRegisterOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>会員登録</h2>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>ユーザー名</label>
                <input type="text" required value={regUsername} onChange={(e) => setRegUsername(e.target.value)} />
              </div>
              <div className="form-group">
                <label>メールアドレス</label>
                <input type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label>確認用メールアドレス</label>
                <input type="email" required value={regEmailConfirm} onChange={(e) => setRegEmailConfirm(e.target.value)} />
              </div>
              <div className="form-group">
                <label>パスワード</label>
                <input type="password" required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
              </div>

              {regError && <p className="error-text">{regError}</p>}
              
              <div className="modal-actions">
                <button type="button" onClick={() => setIsRegisterOpen(false)}>キャンセル</button>
                <button type="submit">登録する</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoginOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>ログイン</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>メールアドレス</label>
                <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label>パスワード</label>
                <input type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
              </div>
              {loginError && <p className="error-text">{loginError}</p>}
              <div className="modal-actions">
                <button type="button" onClick={() => setIsLoginOpen(false)}>キャンセル</button>
                <button type="submit">ログイン</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  
  )
}

export default App