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
  //秘密投稿用
  const [usersList, setUsersList] = useState([]);
  const [targetUserId, setTargetUserId] = useState(""); 
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
  // グループ作成用
  const [groups, setGroups] = useState([]); 
  const [activeGroupId, setActiveGroupId] = useState(null); 
  const [isGroupCreateOpen, setIsGroupCreateOpen] = useState(false); 
  const [newGroupName, setNewGroupName] = useState(""); 

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/v1/users');
      if (response.ok) {
        const data = await response.json();
        setUsersList(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/v1/groups');
      if (response.ok) {
        const data = await response.json();
        setGroups(data);
        if (data.length > 0 && !activeGroupId) {
          setActiveGroupId(data[0].id);// 最初のグループをアクティブにする
        }
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const fetchMessages = async () => {
    if(!activeGroupId) return; // グループが選択されていない場合は何もしない
      try {
        const url = currentUser
        ? `http://localhost:8082/api/v1/posts?groupId=${activeGroupId}&userId=${currentUser.id}`
        : `http://localhost:8082/api/v1/posts?groupId=${activeGroupId}`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setMessages(data); 
        } 
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    useEffect(() => {
      fetchUsers();
      fetchGroups();
    }, []);
    useEffect(() => {
      fetchMessages();
      const interval = setInterval(()=>{fetchMessages();}, 2000); // 2秒ごとにメッセージを更新
      return () => clearInterval(interval); // クリーンアップ
    }, [currentUser,activeGroupId]);
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
       userId: currentUser.id,
       targetUserId: targetUserId ? parseInt(targetUserId) : null,
       groupId: activeGroupId
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
      setTargetUserId("");
      fetchMessages(); // 送信後にメッセージを更新
      console.log("successfully sent message: " + input);
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

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("本当に削除しますか？")) return;
    try {
      const url = `http://localhost:8082/api/v1/posts/${messageId}?userId=${currentUser.id}`;
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchMessages();
      } else {
        const errorText = await response.text();
        alert(`削除失敗: ${errorText}`);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    try {
      const response = await fetch('http://localhost:8082/api/v1/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newGroupName })
      });

      if (response.ok) {
        const createdGroup = await response.json();
        setNewGroupName("");
        setIsGroupCreateOpen(false);
        fetchGroups(); 
        setActiveGroupId(createdGroup.id); 
      } else {
        alert("グループの作成に失敗しました。");
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
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
          <button onClick={() => setIsGroupCreateOpen(true)}>グループ作成</button>
        </div>
        <ul className="group-list" style={{ listStyleType: 'none', padding: 0 }}>
          {groups.map((group) => (
            <li 
              key={group.id} 
              onClick={() => setActiveGroupId(group.id)}
              style={{
                cursor: 'pointer',
                padding: '10px',
                backgroundColor: activeGroupId === group.id ? '#4caf50' : 'transparent',
                color: activeGroupId === group.id ? 'white' : '#333',
                borderBottom: '1px solid #ddd'
              }}
            >
              # {group.name}
            </li>
          ))}
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
            <div key={msg.id || index} className="message" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
              <span style={{ fontWeight: 'bold', marginRight: '10px' }}>
                {msg.user ? msg.user.username : "不明なユーザー"}
              </span>
              {msg.targetUser &&(//秘密投稿のときは黄色のタグを表示
                <span style={{ backgroundColor: '#ffeb3b', color: '#333',fontSize: '0.8em', padding: '2px 6px', borderRadius: '4px', marginRight: '10px' }}>
                  {msg.targetUser.username}さんへの秘密投稿
                </span>
              )}
              {msg.content}
              </div>
              {currentUser && msg.user && currentUser.id === msg.user.id && (
                <button onClick={() => handleDeleteMessage(msg.id)} style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
                >削除</button>
              )}
            </div>
          ))}
        </div>
  
        <footer className="footer">
          <div style={{ display: 'flex',flexDirection: 'column', width: '100%',marginRight: '10px' }}>
            <select value={targetUserId} onChange={(e) => setTargetUserId(e.target.value)} style={{ marginBottom: '5px' ,padding: '5px', width: '200px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="">全員に公開する</option>
              {usersList.map((u) => (
               currentUser && u.id !== currentUser.id && (
                <option key={u.id} value={u.id}>
                  {u.username}さんへの秘密投稿
                </option>
               )
              ))}
            </select>
            <textarea
           className="messageInput"
           placeholder={activeGroupId ? "#メッセージを入力" : "グループを作成または選択してください"}
           value={input}
           onChange={(e) => setInput(e.target.value)}
           ></textarea></div>
          <div><button onClick={handleSendMessage} style={{ height: '100%', cursor: !activeGroupId ? 'not-allowed' : 'pointer' }}
              disabled={!activeGroupId}>送信</button></div>
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

      {isGroupCreateOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>新しいグループを作成</h2>
            <form onSubmit={handleCreateGroup}>
              <div className="form-group">
                <label>グループ名</label>
                <input type="text" required value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setIsGroupCreateOpen(false)}>キャンセル</button>
                <button type="submit">作成する</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  
  )
}

export default App