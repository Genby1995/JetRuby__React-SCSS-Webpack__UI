import axios from "axios";
import React, { useEffect, useState } from "react";

function App() {
    const [status, setStatus] = useState("ready");
    const [message, setMessage] = useState("Ready to use");
    const [allRepos, setAllRepos] = useState([]);
    const [oneRepo, setOneRepo] = useState({
        html_url: "?",
        stargazers_count: "?",
        repoId: "?",
        full_name: "?",
    });
    const [inputs, setInputs] = useState({
        repoMaxAge_d: 2,
        timerPeriod_h: 0,
        timerPeriod_m: 10,
        timerPeriod_s: 0,
        repoCount: 5,
        repoId: "123456789",
    });

    useEffect(() => {
        getAllRepos();
        getConfig();
    }, []);

    // const API_URL = "http://localhost:8800/api";
    const API_URL = "https://jetruby.onrender.com/api";

    const getAllRepos = () => {
        setStatus("loading");
        setMessage("loading");
        axios
            .get(`${API_URL}/trending`)
            .then((res) => {
                setAllRepos(res.data.data);
                setMessage(res.data.message);
            })
            .catch((err) => {
                setMessage(err?.response?.data?.message || err?.message);
            })
            .finally(() => {
                setStatus("ready");
            });
    };

    const getConfig = () => {
        setStatus("loading");
        setMessage("loading");
        axios
            .get(`${API_URL}/config`)
            .then((res) => {
                let inputsClone = Object.assign({}, inputs);
                inputsClone.repoMaxAge_d = Math.round(
                    res.data.config.repoMaxAge / (1000 * 60 * 60 * 24)
                );
                inputsClone.timerPeriod_h = Math.floor(
                    res.data.config.timerPeriod / (1000 * 60 * 60)
                );
                inputsClone.timerPeriod_m = Math.floor(
                    (res.data.config.timerPeriod % (1000 * 60 * 60)) /
                        (1000 * 60)
                );
                inputsClone.timerPeriod_s = Math.floor(
                    (res.data.config.timerPeriod % (1000 * 60)) / 1000
                );

                inputsClone.repoCount = Math.round(res.data.config.repoCount);
                setInputs(inputsClone);
                setMessage(res.data.message);
            })
            .catch((err) => {
                setMessage(err?.response?.data?.message || err?.message);
            })
            .finally(() => {
                setStatus("ready");
            });
    };

    const getOneRepo = () => {
        setStatus("loading");
        setMessage("loading");
        axios
            .get(`${API_URL}/trending/id${inputs.repoId}`)
            .then((res) => {
                setOneRepo(res?.data?.data);
                setMessage(res?.data?.message);
            })
            .catch((err) => {
                setOneRepo({
                    html_url: "?",
                    stargazers_count: "?",
                    repoId: "?",
                    full_name: "?",
                });
                setMessage(err?.response?.data?.message || err?.message);
            })
            .finally(() => {
                setStatus("ready");
            });
    };

    const updateDB = () => {
        const timerPeriod =
            inputs.timerPeriod_s * 1000 +
            inputs.timerPeriod_m * 1000 * 60 +
            inputs.timerPeriod_h * 1000 * 60 * 60;
        if (timerPeriod < 10000) {
            return setMessage(
                "Refresh period should be longer, than 10 seconds"
            );
        }
        const repoMaxAge = +inputs.repoMaxAge_d * 1000 * 60 * 60 * 24;
        const repoCount = +inputs.repoCount;

        setStatus("loading");
        setMessage("loading");
        axios
            .put(`${API_URL}/update`, {
                repoMaxAge: repoMaxAge,
                repoCount: repoCount,
                timerPeriod: timerPeriod,
            })
            .then((res) => {
                setAllRepos(res?.data?.data);
                setMessage(res?.data?.message);
            })
            .catch((err) => {
                setMessage(err?.response?.data?.message || err?.message);
            })
            .finally(() => {
                setStatus("ready");
            });
    };

    const handleInputChange = (e) => {
        let inputsClone = Object.assign({}, inputs);
        inputsClone[e.target.name] = e.target.value;
        setInputs(inputsClone);
    };

    const repos = allRepos.map((item) => {
        return (
            <li key={item._id} className={"li-item"}>
                <b style={{ fontWeight: "bold", color: "red" }}>
                    {"Stars: " + item.stargazers_count}
                </b>
                <b style={{ color: "orange" }}>{"ID: " + item.repoId + " "}</b>
                <a href={item.html_url}>Link to GitHub page</a>
                <p style={{ color: "green" }}>
                    {"Reposytiry: " + item.full_name}
                </p>
            </li>
        );
    });

    return (
        <div className="main-wrapper">
            <div className="main-container">
                <div className="inputs-container">
                    <h2>Repository search Parameters</h2>
                    <button onClick={getConfig} disabled={status == "loading"}>
                        Get actual server parameters
                    </button>

                    <h4>Age of searched repositories: </h4>
                    <p> {"- Days: " + inputs.repoMaxAge_d} </p>
                    <input
                        disabled={status == "loading"}
                        name="repoMaxAge_d"
                        value={inputs.repoMaxAge_d}
                        type="range"
                        min={0}
                        max={31}
                        onChange={handleInputChange}
                    />
                    <span>
                        Here the number of days from today is put. The creation
                        date of all repositories will have to fall within the
                        received period.
                    </span>
                    <h4>Refresh period of information in database: </h4>
                    <p> {"- Hours: " + inputs.timerPeriod_h} </p>
                    <input
                        disabled={status == "loading"}
                        name="timerPeriod_h"
                        value={inputs.timerPeriod_h}
                        type="range"
                        onChange={handleInputChange}
                    />
                    <p> {"- Minutes: " + inputs.timerPeriod_m} </p>
                    <input
                        disabled={status == "loading"}
                        name="timerPeriod_m"
                        value={inputs.timerPeriod_m}
                        type="range"
                        min={0}
                        max={60}
                        onChange={handleInputChange}
                    />
                    <p> {"- Seconds: " + inputs.timerPeriod_s} </p>
                    <input
                        disabled={status == "loading"}
                        name="timerPeriod_s"
                        value={inputs.timerPeriod_s}
                        type="range"
                        min={0}
                        max={60}
                        onChange={handleInputChange}
                    />
                    <span>
                        The time intervals (hours, minutes, secconds) are summed
                        up. In order to prevent the GitHub API from temporarily
                        blocking access to the update, it is forbidden to set a
                        total time interval of less than 5 seconds
                    </span>
                    <h4>Колличество репозиториев: </h4>
                    <p> {"- Штук: " + inputs.repoCount} </p>
                    <input
                        disabled={status == "loading"}
                        name="repoCount"
                        value={inputs.repoCount}
                        type="range"
                        min={1}
                        max={50}
                        onChange={handleInputChange}
                    />
                    <span>
                        {`Не более 100. Указывается колличество репозиториев,
                        скачиваемых в базу данных при каждом обращении к GitHub
                        API`}
                        No more than 50. This parameter specifies the number of
                        repositories downloaded to the database each time the
                        GitHub API is addressed.
                    </span>

                    <button onClick={getOneRepo} disabled={status == "loading"}>
                        {`Get from the database the repository with ID: ${inputs.repoId}`}
                    </button>
                    <input
                        name="repoId"
                        value={inputs.repoId}
                        type="number"
                        onChange={handleInputChange}
                    />
                    <span>The result is displayed below.</span>
                </div>

                <div className="buttons-container">
                    <h2>Servise actions</h2>
                    <span>STATUS: {message}</span>
                    <button
                        onClick={getAllRepos}
                        disabled={status == "loading"}
                    >
                        Get all repositiries from database
                    </button>
                    <button onClick={updateDB} disabled={status == "loading"}>
                        Refresh database with repositorues from GitHub API
                    </button>
                </div>

                <div className="repos-container">
                    <h2>Result of repository search by ID in database</h2>
                    <ol>
                        <li className={"li-item"}>
                            <b style={{ fontWeight: "bold", color: "red" }}>
                                {"Stars: " + oneRepo.stargazers_count}
                            </b>
                            <b style={{ color: "orange" }}>
                                {"ID: " + oneRepo.repoId}
                            </b>
                            <a href={oneRepo.html_url}>Link to GitHub page</a>
                            <p style={{ color: "green" }}>
                                {"Reposytiry: " + oneRepo.full_name}
                            </p>
                        </li>
                    </ol>
                </div>

                <div className="repos-container">
                    <h2>Repositiries in database</h2>
                    <ol>{repos}</ol>
                </div>
            </div>
        </div>
    );
}

export default App;
