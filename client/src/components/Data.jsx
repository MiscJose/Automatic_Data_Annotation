import axios from "axios";
import { useEffect, useState } from "react";

function Data() {
  const [title, setTitle] = useState("");
  const [numPoints, setNumPoints] = useState(3);
  const [model, setModel] = useState("RoBERTa");
  const [annotation, setAnnotation] = useState("Sentiment");
  const [points, setPoints] = useState(Array(parseInt(3)).fill(""));
  const [labels, setLabels] = useState(Array(parseInt(3)).fill(""));
  const [confidence, setConfidence] = useState(Array(parseInt(3)).fill(""));
  const [loading, setLoading] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [userUploaded, setUserUploaded] = useState(false);
  const [userData, setUserData] = useState([]);

  const [file, setFile] = useState(null);
  const [delimeter, setDelimeter] = useState("");

  const [urls, setUrls] = useState(Array(parseInt(3)).fill(""));

  async function getFile(title, data) {
    const res = await axios.post(
      "/file",
      { title, data },
      {
        responseType: "blob",
      }
    );
    const url = URL.createObjectURL(new Blob([res.data]));

    return url;
  }

  async function handleURLS(data) {
    const temp = Array(parseInt(data.length)).fill("");
    for (let i = 0; i < data.length; i++) {
      temp[i] = await getFile(data[i].title, data[i]);
    }
    setUrls(temp);
  }

  useEffect(() => {
    async function complete() {
      axios.get("/account").then(({ data }) => {
        setUserData(data);

        handleURLS(data);
      });
    }
    complete();
  }, [userUploaded]);

  function handleTitle(ev) {
    setTitle(ev.target.value);
  }

  function handleModel(ev) {
    setModel(ev.target.value);
  }
  function handleAnnotation(ev) {
    setAnnotation(ev.target.value);
  }

  function handleNumPoints(ev) {
    ev.preventDefault();
    setNumPoints(parseInt(ev.target.value));
    setPoints(Array(parseInt(ev.target.value)).fill(""));
    setLabels(Array(parseInt(ev.target.value)).fill(""));
    setConfidence(Array(parseInt(ev.target.value)).fill(""));
    setUrls(Array(parseInt(ev.target.value)).fill(""));
  }

  const handlePoints = (i) => (ev) => {
    ev.preventDefault();
    setPoints((oldPoints) => {
      const temp = [...oldPoints];
      temp[i] = ev.target.value;
      return temp;
    });
  };

  function handleFileUpload(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.append("file", file[0]);
    data.append("delimeter", delimeter);
    axios
      .post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {

        const points = res.data
        setNumPoints(parseInt(points.length));
        setPoints(points);
        setLabels(Array(parseInt(points.length)).fill(""));
        setConfidence(Array(parseInt(points.length)).fill(""));
        setUrls(Array(parseInt(points.length)).fill(""));
      });
  }

  async function annotateData(ev) {
    setLoading(true);

    ev.preventDefault();
    const temp = [model, annotation];
    const formData = temp.concat(points);

    await axios
      .post("/python", {
        formData,
      })
      .then(({ data }) => {
        Object.keys(data).map((key, i) => {
          setLabels((old) => {
            const temp = [...old];
            temp[i] = data[key].label;
            return temp;
          });

          setConfidence((old) => {
            const temp = [...old];
            temp[i] = data[key].score;
            return temp;
          });
        });
      });

    setLoading(false);
    setShowAnnotations(true);
  }

  async function uploadData() {
    setShowAnnotations(false);
    await axios.post("/data", {
      title,
      points,
      labels,
      confidence,
      annotation,
      model,
    });

    setUserUploaded((val) => !val);
  }

  return (
    <div>
      <div className="mt-4 grow flex flex-col items-center justify-around">
        {/* Before Form */}
        <div className="w-full p-2">
          <p className="text-2xl mb-4">Enter Data</p>
        </div>

        <div className="w-full px-36">
          <div></div>
          <form onSubmit={handleFileUpload} className="mx-auto border-4 shadow">
            <div className="flex flex-col">
              <div className="flex justify-center">
                <p className="font-bold">Upload File Here</p>
              </div>

              <div className="flex p-2 justify-around">
                <input
                  onChange={(ev) => setFile(ev.target.files)}
                  className="p-1"
                  id="file"
                  type="file"
                />
                <select
                  onChange={(ev) => setDelimeter(ev.target.value)}
                  className="p-1"
                  name="delimeter"
                  id="delimeter"
                >
                  <option value="">Delimeter</option>
                  <option value=";">Semicolon</option>
                  <option value=",">Comma</option>
                  <option value="\n">New-Line</option>
                </select>
              </div>
              <div className="p-2 flex justify-center">
                {" "}
                <div className="w-1/5">
                  <button className="primary">Upload File</button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* For the form */}
        <div className=" w-full px-36 ">
          <form className="mx-auto border-4 " onSubmit={annotateData} action="">
            <div className="flex flex-col">
              <div>
                <p className="font-bold">Enter or Edit Data</p>
              </div>
              <div className="flex p-2">
                <div className="grow py-4">
                  <label className="font-bold" htmlFor="title" required>
                    TITLE{" "}
                  </label>
                </div>
                <div className="flex-auto">
                  <input
                    id="title"
                    placeholder="..."
                    type="text"
                    onChange={handleTitle}
                    value={title}
                    required
                  />
                </div>
              </div>

              <div className="flex p-2">
                <div className="grow py-4">
                  <label className="font-bold" htmlFor="numPoints">
                    DATA
                  </label>
                </div>
                <div className="flex-auto">
                  <input
                    id="numPoints"
                    type="number"
                    onChange={handleNumPoints}
                    value={numPoints}
                  />
                </div>
              </div>

              <div className="flex flex-col p-2">
                {/* Dynamic Data Points */}
                <div className="flex flex-col p-2">
                  {points.map((val, i) => {
                    return (
                      <div key={i}>
                        <input
                          className="max-w-lg"
                          onChange={handlePoints(i)}
                          type="text"
                          value={val}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* For Selection of Methods */}

              <div className="flex flex-col p-2">
                <div className="flex justify-around">
                  <div className="flex">
                    <div className="p-1 font-bold">
                      <p>MODEL: </p>
                    </div>
                    <div className="p-1">
                      <select onChange={handleModel} name="models" id="models">
                        <option value="RoBERTa">RoBERTa</option>

                        <option value="BERT">BERT</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="p-1 font-bold">
                      <p>Annotation: </p>
                    </div>
                    <div className="p-1">
                      <select
                        onChange={handleAnnotation}
                        name="Annotation"
                        id="Annotation"
                      >
                        <option value="Spam">Spam</option>
                        <option value="Sentiment">Sentiment</option>
                        <option value="Emotion">Emotion</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex p-4 justify-center">
                <div className="flex w-1/5">
                  <button className="primary">Annotate Data</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* loading feature */}
      {loading && (
        <div className="p-2">
          <p className="font-bold">Loading ...</p>
        </div>
      )}

      {showAnnotations && (
        <div>
          <div className="mt-4 grow flex items-center justify-around p-4">
            <div className="flex-auto p-2">
              <div>
                <p className="font-bold">Annotations</p>
              </div>
              <div className="">
                <form action="">
                  <div className="flex flex-col">
                    {labels.map((val, i) => {
                      return (
                        <div key={i}>
                          <input type="text" value={val} required />
                        </div>
                      );
                    })}
                  </div>
                </form>
              </div>
            </div>
            <div className="flex-auto p-2">
              <div>
                <p className="font-bold">Confidence</p>
              </div>
              <div className="">
                <form action="">
                  <div className="flex flex-col">
                    {confidence.map((val, i) => {
                      return (
                        <div key={i}>
                          <input type="text" value={val} required />
                        </div>
                      );
                    })}
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="flex justify-center p-2">
            <div className=" flex w-36">
              <button onClick={uploadData} className="primary">
                Upload Data
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full p-2">
        <p className="text-2xl mb-4">Existing Data</p>
      </div>

      <div className="flex flex-col p-4">
        {userData.map((data, i) => {
          return (
            <div key={i} className="flex flex-col p-2">
              <div className="flex">
                <p className="font-bold">
                  {data.title} [{data.annotation} {data.model}]
                </p>
              </div>
              <div className="flex">
                <div>
                  <div className="flex flex-col p-2">
                    {data.points.map((val, j) => {
                      return (
                        <div key={j}>
                          <input
                            className="max-w-lg"
                            type="text"
                            value={val}
                            readOnly
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <div className="flex flex-col p-2">
                    {data.labels.map((val, j) => {
                      return (
                        <div key={j}>
                          <input
                            className="max-w-lg"
                            type="text"
                            value={val}
                            readOnly
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <div className="flex flex-col p-2">
                    {data.confidence.map((val, j) => {
                      return (
                        <div key={j}>
                          <input
                            className="max-w-lg"
                            type="text"
                            value={val}
                            readOnly
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex p-2">
                <div className="">
                  <button className="primary">
                    <a download={"temp.json"} href={urls[i]}>
                      Download
                    </a>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Data;
