import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { socket } from "./socket";
import { useParams } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ChatPanel from "./components/ChatPanel";
// import OutputConsole from "./components/OutputConsole";
// const [username, setUsername] = useState("");

function App() {
  const [aiQuestion, setAiQuestion] =
  useState("");

const [aiResponse, setAiResponse] =
  useState("");
  const [showAI, setShowAI] =
  useState(false);
  const [username, setUsername] = useState("");
  const { roomId } = useParams();

  const [code, setCode] = useState('print("Hello Aditya")');
  
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<any[]>([]);
  const [output, setOutput] = useState("");
  const [notes, setNotes] = useState("");
  const [users, setUsers] = useState<string[]>([]);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [editorRef, setEditorRef] =
  useState<any>(null);
  const [remoteCursors, setRemoteCursors] =
  useState<Record<string, any>>({});
  const [decorations, setDecorations] =
  useState<string[]>([]);
  const [files, setFiles] = useState([
  {
    id: "1",
    name: "main.py",
    content: 'print("Hello Aditya")',
  },
]);

const [activeFileId, setActiveFileId] =
  useState("1");

const activeFile =
  files.find(
    (file) =>
      file.id === activeFileId
  );  

  

const [aiLoading, setAiLoading] =
  useState(false);



  
  // const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {

  const name = prompt(
    "Enter your name"
  );

  if (name) {

    setUsername(name);

    socket.emit(
      "set_username",
      name
    );

    if (roomId) {
      socket.emit(
        "join_room",
        roomId
      );
    }
  }

}, []);

//   useEffect(() => {
//     if (roomId) {
//       socket.emit("join_room", roomId);
//     }

//     const handleMessage = (msg: string) => {
//       console.log("RECEIVED:", msg);
//       setMessages((prev) => [...prev, msg]);
//     };

//     // socket.on("receive_message", handleMessage);
//     socket.on(
//   "receive_message",
//   (msg) => {
//     setMessages(
//       prev => [...prev, msg]
//     );
//   }
// );

//     return () => {
//       socket.off("receive_message", handleMessage);
//     };
//   }, [roomId]);

//   useEffect(() => {

//   const handleNotes = (newNotes: string) => {
//     setNotes(newNotes);
//   };

//   socket.on(
//     "notes_update",
//     handleNotes
//   );

//   return () => {
//     socket.off(
//       "notes_update",
//       handleNotes
//     );
//   };

// }, []);

useEffect(() => {

  // if (roomId) {
  //   socket.emit("join_room", roomId);
  // }

  const handleMessage = (msg: any) => {
    setMessages(prev => [...prev, msg]);
  };

  const handleSystemMessage = (msg: any) => {
    setMessages(prev => [...prev, msg]);
  };

  socket.on(
    "receive_message",
    handleMessage
  );

  socket.on(
    "system_message",
    handleSystemMessage
  );

  return () => {

    socket.off(
      "receive_message",
      handleMessage
    );

    socket.off(
      "system_message",
      handleSystemMessage
    );

  };

}, [roomId]);

useEffect(() => {

  socket.on(
    "user_typing",
    (name: string) => {

      setTypingUser(name);

      setTimeout(() => {
        setTypingUser("");
      }, 1500);

    }
  );

  return () => {
    socket.off("user_typing");
  };

}, []);

useEffect(() => {

  socket.on(
    "file_created",
    (file) => {

      setFiles(
        prev => [...prev, file]
      );

    }
  );

  return () => {
    socket.off(
      "file_created"
    );
  };

}, []);

useEffect(() => {

  socket.on(
    "file_updated",
    (data) => {

      setFiles(
        prev =>
          prev.map((file) =>
            file.id === data.id
              ? {
                  ...file,
                  content:
                    data.content,
                }
              : file
          )
      );

    }
  );

  return () => {
    socket.off(
      "file_updated"
    );
  };

}, []);

useEffect(() => {

  socket.on(
    "users_update",
    (usersList: string[]) => {
      setUsers(usersList);
    }
  );

  return () => {
    socket.off("users_update");
  };

}, []);

useEffect(() => {

  if (!editorRef) return;

  const newDecorations: Array<any> = [];

  Object.values(remoteCursors).forEach(
    (cursor: any) => {

      newDecorations.push({

        range: {
          startLineNumber: cursor.line,
          startColumn: 1,
          endLineNumber: cursor.line,
          endColumn: 1,
        },

        options: {
          isWholeLine: true,
          className:
            "remote-line-highlight",
        },

      });

    }
  );

  const ids =
    editorRef.deltaDecorations(
      decorations,
      newDecorations
    );

  setDecorations(ids);

}, [remoteCursors]);


useEffect(() => {

  socket.on(
    "cursor_update",
    (data) => {
      console.log(
  "MY USERNAME =",
  username
);

console.log(
  "CURSOR RECEIVED =",
  data.user
);
      if (data.user === username) return;
      setRemoteCursors(
        (prev: Record<string, any>) => ({
          ...prev,
          [data.user]: data
        })
      );

    }
  );

}, []);


useEffect(() => {

  socket.on(
    "cursor_update",
    (data) => {

      console.log(
        "CURSOR RECEIVED",
        data
      );

    }
  );

  return () => {
    socket.off("cursor_update");
  };

}, []);

useEffect(() => {

  console.log(
    "REMOTE CURSORS",
    remoteCursors
  );

}, [remoteCursors]);



  useEffect(() => {
    const handleCodeUpdate = (newCode: string) => {
      setCode(newCode);
    };

    socket.on("code_update", handleCodeUpdate);
    socket.on(
  "room_state",
  (data) => {

    setCode(data.code);

    setNotes(data.notes);

    setMessages(data.chat);
  }
);

    return () => {
      socket.off("code_update", handleCodeUpdate);
    };
  }, []);

  const handleNotesChange = (
  e: React.ChangeEvent<HTMLTextAreaElement>
) => {

  const value = e.target.value;

  setNotes(value);

  socket.emit(
    "notes_change",
    value
  );
};
  const runCode = async () => {
    
  
  const response = await fetch(
    "http://localhost:8000/run",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
  code: activeFile?.content || ""
})
    }
  );
  

  const data = await response.json();

  setOutput(
    data.stdout || data.stderr
  );


};

const askAI = async () => {

  const response =
    await fetch(
      "http://localhost:8000/ask-ai",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          question: aiQuestion,
          code: activeFile?.content || "",
        }),
      }
    );

  const data =
    await response.json();

  console.log(data);

  setAiResponse(
  data.answer.replace(/```[\w]*\n?/g, "")
);
};

  const sendMessage = () => {
    if (!message.trim()) return;

    console.log("SENDING:", message);

    socket.emit(
  "send_message",
  {
    "user": username,
    "text": message
  }
)

    setMessage("");
  };

  const chatMessages = messages.map((msg, index) => ({
  id: String(index),
  username: msg.user,
  message: msg.text,
  timestamp: Date.now(),
}));

  return (
    <> <Navbar

  roomId={roomId || ""}

  isConnected={true}

  userCount={users.length}

  leftCollapsed={leftCollapsed}

  

  onToggleLeft={() =>

    setLeftCollapsed(!leftCollapsed)

  }

  rightCollapsed={rightCollapsed}

onToggleRight={() =>

  setRightCollapsed(!rightCollapsed)

}
onToggleAI={() =>

  setShowAI(

    prev => !prev

  )

}

/>

    
  <div
  style={{
    height: "calc(100vh - 60px)",
    display: "flex",
  }}
>
  <Sidebar
    users={users.map((u) => ({
      id: u,
      username: u,
    }))}
    roomId={roomId || ""}
    currentUsername={username}
    collapsed={leftCollapsed}
  />
  {/* <div
  style={{
    padding: "10px",
    borderBottom: "1px solid gray",
  }}
>
  <h4>Active Editors</h4>

  {Object.values(remoteCursors).map(
    (cursor: any) => (
      <div key={cursor.user}>
        {cursor.user} → Line {cursor.line}
      </div>
    )
  )}
</div> */}


<div
  style={{
    margin: "12px",
    padding: "12px",
    borderRadius: "16px",
    background: "var(--bg-card)",
    border: "1px solid var(--border-subtle)",
  }}
>
  <div
    style={{
      fontSize: "12px",
      fontWeight: 700,
      color: "var(--text-muted)",
      marginBottom: "10px",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
    }}
  >
    Active Editors
  </div>

  {Object.values(remoteCursors).length === 0 ? (
    <div
      style={{
        color: "var(--text-muted)",
        fontSize: "12px",
      }}
    >
      No active editors
    </div>
  ) : (
    Object.values(remoteCursors).map(
      (cursor: any) => (
        <div
          key={cursor.user}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 10px",
            borderRadius: "10px",
            marginBottom: "6px",
            background:
              "rgba(124,58,237,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#22c55e",
              }}
            />

            <span
              style={{
                fontWeight: 600,
                fontSize: "13px",
              }}
            >
              {cursor.user}
            </span>
          </div>

          <span
            style={{
              fontSize: "12px",
              color: "var(--text-muted)",
            }}
          >
            Line {cursor.line}
          </span>
        </div>
      )
    )
  )}
</div>
{
  showAI && (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "450px",
        height: "550px",
        background:
          "var(--bg-surface)",
        border:
          "1px solid var(--border-subtle)",
        borderRadius: "16px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow:
          "0 20px 50px rgba(0,0,0,.35)",
      }}
    >
      <div
        style={{
          padding: "12px",
          borderBottom:
            "1px solid var(--border-subtle)",
          fontWeight: 600,
        }}
      >
        🤖 AI Assistant
      </div>

      {/* <textarea
        placeholder="Ask your coding doubt..."
        style={{
          flex: 1,
          margin: "12px",
          resize: "none",
        }}
      /> */}
      <textarea
  value={aiQuestion}
  onChange={(e) =>
    setAiQuestion(
      e.target.value
    )
  }
  placeholder="Ask your coding doubt..."
  style={{
    flex: 1,

    overflowY: "auto",

    margin: "12px",

    padding: "16px",
    paddingLeft: "12px",

    border: "1px solid var(--border-subtle)",

    borderRadius: "10px",

    background: "white",
  }}
/>
      
      {/* <div
  style={{
    height: "300px",
    overflowY: "auto",
    margin: "12px",
    padding: "10px",
    border: "1px solid gray",
    borderRadius: "8px",
  }}
>
  {aiResponse}
</div> */}
      <pre
  style={{
    
    whiteSpace: "pre-wrap",
    fontFamily: "monospace",
    margin: 0,
  }}
>
  {aiResponse}
</pre>
      <button
        onClick={askAI}
  style={{
    
    
    margin: "12px",
    padding: "10px",
  }}
>
  ASK AI
</button>
    </div>
  )
}

  {/* Editor + Output */}
  <div
    style={{
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
    }}
  >
    {/* <div
      style={{
        padding: "10px",
        borderBottom: "1px solid gray",
      }}
    >
      <button onClick={runCode}>
        ▶ Run Python
      </button>
    </div> */}
    <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px",
    borderBottom:
      "1px solid gray",
  }}
>
  {files.map((file) => (
    <button
      key={file.id}
      onClick={() =>
        setActiveFileId(file.id)
      }
      style={{
        padding: "8px 12px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        background:
          file.id === activeFileId
            ? "#4f46e5"
            : "#333",
        color: "white",
      }}
    >
      {file.name}
    </button>
  ))}

  <button
    onClick={() => {

      const newFile = {
        id: Date.now().toString(),
        name: `file${files.length + 1}.py`,
        content: "",
      };

      // setFiles([
      //   ...files,
      //   newFile,
      // ]);
      socket.emit(
  "create_file",
  newFile
);

      setActiveFileId(
        newFile.id
      );

    }}
  >
    +
  </button>

  <button
    onClick={runCode}
  >
    ▶ Run
  </button>
</div>

    <div
      style={{
        flex: 1,
        minWidth: 0,
      }}
    >
      <Editor
        key={leftCollapsed ? "collapsed" : "open"}
        onMount={(editor) => {

  setEditorRef(editor);

  editor.onDidChangeCursorPosition(
    (e) => {

      socket.emit(
        "cursor_change",
        {
          line: e.position.lineNumber,
          column: e.position.column
        }
      );

    }
  );

}}
        height="100%"
        defaultLanguage="python"
        value={activeFile?.content}
//         onChange={(value) => {

//   const updatedCode = value || "";

//   setFiles(
//     files.map((file) =>
//       file.id === activeFileId
//         ? {
//             ...file,
//             content: updatedCode,
//           }
//         : file
//     )
//   );

// }}

            onChange={(value) => {

  const updatedCode =
    value || "";

  setFiles(
    prev =>
      prev.map((file) =>
        file.id === activeFileId
          ? {
              ...file,
              content:
                updatedCode,
            }
          : file
      )
  );

  socket.emit(
    "update_file",
    {
      id: activeFileId,
      content:
        updatedCode,
    }
  );

}}
      />
    </div>

    <div
      style={{
        height: "180px",
        borderTop: "1px solid gray",
        padding: "10px",
        overflowY: "auto",
        backgroundColor: "#111",
        color: "#00ff66",
        fontFamily: "monospace",
      }}
    >
      <h4>Output</h4>

      <pre
        style={{
          whiteSpace: "pre-wrap",
          margin: 0,
        }}
      >
        {output || "No output yet"}
      </pre>
    </div>
  </div>

  <ChatPanel
  messages={chatMessages}
  currentUsername={username}
  onSendMessage={(msg) => {
    socket.emit("send_message", {
      user: username,
      text: msg,
    });
  }}
  collapsed={rightCollapsed}
  typingUser={typingUser}

  
/>
   {typingUser && (
  <div
    style={{
      padding: "5px",
      fontSize: "12px",
      color: "gray",
    }}
  >
    {typingUser} is typing...
  </div>
)}
</div>


  </>
);
}

export default App;