import { useEffect, useState, useRef } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import ecellLogo from "/images/icon-128.png";
import "./App.css";

const docTypes = {
  docs: /\/docs.google.com\/document\/d\/([a-zA-Z0-9\-_]*)\//,
  slides: /\/docs.google.com\/presentation\/d\/([a-zA-Z0-9\-_]*)\//,
  sheets: /\/docs.google.com\/spreadsheets\/d\/([a-zA-Z0-9\-_]*)\//,
  repo: /github.com\/([a-zA-Z0-9\-_]*)\/([a-zA-Z0-9\-_]*)/,
  figma: /figma.com\/file\/([a-zA-Z0-9\-_]*)\/([a-zA-Z0-9\-_]*)/,
};

function App() {
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState("other");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const textAreaRef = useRef(null);

  const onClick = async () => {
    setIsLoading(true);
    try {
      const csrfToken = await new Promise<string>((resolve) => {
        chrome.cookies.get(
          { url: "http://localhost:4200", name: "csrftoken" },
          function (cookie) {
            resolve(cookie?.value || "");
          }
        );
      });

      const sessionId = await new Promise<string>((resolve) => {
        chrome.cookies.get(
          { url: "http://localhost:4200", name: "sessionid" },
          function (cookie) {
            resolve(cookie?.value || "");
          }
        );
      });

      const response = await fetch("http://localhost:8000/api/doc/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
          Cookie: `sessionid=${sessionId}`,
        },
        body: JSON.stringify({
          title,
          link,
          description: "",
          doc_type: docType,
          tags: [],
        }),
      });

      if (response.status === 201) {
        setIsSuccess(true);
      } else {
        const data = await response.json();
        setError(data?.error ?? data?.detail ?? response.statusText);
      }
      console.log(response);
    } catch (err) {
      setError(`${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const onOpen = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (tab?.url) {
      setLink(tab.url ?? "");

      for (const [type, regex] of Object.entries(docTypes)) {
        if (regex.test(tab.url)) {
          setDocType(type);

          if (type === "repo") {
            const matches = tab.url.match(regex);
            if (matches) {
              setTitle(matches[2]);
            }
          } else if (type === "figma") {
            const matches = tab.url.match(regex);
            if (matches) {
              const titleAndQueryParams = matches[2];
              setTitle(titleAndQueryParams.split("?")[0]);
            }
          } else if (
            type === "docs" ||
            type === "slides" ||
            type === "sheets"
          ) {
            const messageListener = (request: { message: string }) => {
              if (request.message) {
                setTitle(request.message);
              }
            };

            chrome.runtime.onMessage.addListener(messageListener);

            await chrome.scripting.executeScript({
              target: { tabId: tab.id! },
              func: () => {
                const element = document.getElementById(
                  "docs-title-input-label-inner"
                );
                chrome.runtime.sendMessage({
                  message: element?.innerText || "",
                });
              },
            });

            chrome.runtime.onMessage.removeListener(messageListener);
          }
          break;
        }
      }
    }
  };

  const goTo = (url: string) => () => {
    chrome.tabs.create({ url });
  };

  useEffect(() => {
    onOpen();
  }, []);

  const adjustTextAreaHeight = () => {
    if (textAreaRef.current) {
      (textAreaRef.current as HTMLTextAreaElement).style.height = "auto";
      (textAreaRef.current as HTMLTextAreaElement).style.height = `${
        (textAreaRef.current as HTMLTextAreaElement).scrollHeight
      }px`;
    }
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    if (
      error === "Authentication credentials were not provided." ||
      error === "You do not have permission to perform this action."
    ) {
      return (
        <>
          <h1>Error</h1>
          <p>
            You are not logged in. Please login to the portal and try again.
          </p>
          <div className="card">
            <button onClick={goTo("http://localhost:4200")}>
              Add to Portal
            </button>
          </div>
        </>
      );
    }

    return (
      <>
        <h1>Error</h1>
        <p>{error}</p>
      </>
    );
  }

  if (isSuccess) {
    return <h1>Successfully added!</h1>;
  }

  return (
    <>
      <div>
        <a href="https://ecell.in" target="_blank">
          <img src={ecellLogo} className="logo" alt="Vite logo" />
        </a>
        {/* <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a> */}
      </div>
      <h1>Doc Extension</h1>
      <select
        id="doc-type"
        className="select-input"
        value={docType}
        onChange={(e) => setDocType(e.target.value)}
      >
        <option value="docs">Docs</option>
        <option value="slides">Slides</option>
        <option value="sheets">Sheets</option>
        <option value="pdf">PDF</option>
        <option value="repo">Repo</option>
        <option value="figma">Figma</option>
        <option value="other">Other</option>
      </select>
      <input
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="title-input"
      />
      <textarea
        ref={textAreaRef}
        value={link}
        onChange={(e) => {
          setLink(e.target.value);
          adjustTextAreaHeight();
        }}
        className="url-input"
      />
      <div className="card">
        <button onClick={onClick}>Add to Portal</button>
      </div>
    </>
  );
}

export default App;
