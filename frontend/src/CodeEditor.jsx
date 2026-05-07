import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import { socket } from "../socket.js";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useLocation } from "react-router";
export const CodeEditor = () => {
  socket.connect();
  const navigate = useNavigate();
  const languagesData = {
    javascript: {
      version: "ES2024",
      boilerplate: `// JavaScript Boilerplate
function main() {
  console.log("Hello, World!");
}
main();`,
    },
    python: {
      version: "3.12",
      boilerplate: `# Python Boilerplate
def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()`,
    },
    java: {
      version: "Java 22",
      boilerplate: `// Java Boilerplate
public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`,
    },
    cpp: {
      version: "C++23",
      boilerplate: `// C++ Boilerplate
#include <iostream>
using namespace std;

int main() {
  cout << "Hello, World!" << endl;
  return 0;
}`,
    },
  };
  const location = useLocation();
  const [currlang, setCurrLang] = useState("javascript");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const roomId = useParams().id;
  const languages = ["javascript", "cpp", "java", "python"];
  const [chats, setChats] = useState([]);
  const username = location.state.username;
  const action = location.state.action;
  const handleEditorChange = (value) => {
    setCode(value);
    socket.emit("code-change", { value, roomId });
  };
  const handleSendMessage = () => {
    socket.emit("send-message", { message, roomId });
    setChats((prev) => [...prev, message]);
  };
  useEffect(() => {
    const handlemessageUpdate = ({ newChat }) => {
      setChats((prev) => [...prev, newChat]);
    };
    socket.on("receive-message", handlemessageUpdate);
    return () => {
      socket.off("receive-message", handlemessageUpdate);
    };
  }, []);
  useEffect(() => {
    if (action == "join") {
      socket.emit("join-room", { roomId, username });
    } else if (action == "create") {
      socket.emit("create-room", { roomId, username });
    }
  }, []);

  useEffect(() => {
    const handleError = () => {
      console.log("Room Does Not Exist");
      navigate("/");
      alert("Room Does not Exists");
    };
    socket.on("error", handleError);
    return () => {
      socket.off("error", handleError);
    };
  }, []);
  useEffect(() => {
    const handleUpdate = ({ value }) => {
      setCode(value);
      console.log("New COde : \n");
      console.log(value);
    };
    socket.on("code-update", handleUpdate);
    return () => {
      socket.off("code-update", handleUpdate);
    };
  }, []);
  useEffect(() => {
    setCode(languagesData[currlang].boilerplate);
  }, [currlang]);

  return (
    <div className="p-5 text-foreground">
      <div className="flex h-150 *:flex-1 *:mt-5">
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="">Language :</div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{currlang}</Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                {languages.map((l) => (
                  <DropdownMenuItem key={l} onSelect={() => setCurrLang(l)}>
                    {l}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mr-2">
            <Editor
              height="70vh"
              language={currlang === "cpp" ? "cpp" : currlang}
              value={code}
              onChange={handleEditorChange}
              theme="vs-dark"
            />
          </div>
        </section>

        <section className="space-y-3 ml-2">
          <button className="border py-1 px-3 rounded">Run</button>

          <div className="h-9/10 pl-2 border ">
            <div className="mt-2">OUTPUT</div>
          </div>
        </section>
      </div>
      <div className="h-100 my-10  flex flex-col border  py-3 ">
        <div className="h-9/10  overflow-scroll">
          {chats.map((ch) => (
            <div className="">{ch}</div>
          ))}
        </div>
        <div className="h-1/10 w-full ">
          <div className="border relative w-full ">
            <input
              type="text"
              className="w-full p-5 text-lg "
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div
              onClick={() => handleSendMessage()}
              className="absolute right-10 top-0  px-5 py-3 "
            >
              Send
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
