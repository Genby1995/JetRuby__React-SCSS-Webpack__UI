import axios from "axios";
import React, { useState } from "react";

function App() {
    const [message, setMessage] = useState("Ready to use");
    const [allRepos, setAllRepos] = useState([]);
    const [oneRepo, setOneRepo] = useState({});
    const [inputs, setInputs] = useState({
        repoMaxAge_d: 2,
        timerPeriod_h: 0,
        timerPeriod_m: 10,
        timerPeriod_s: 0,
        repoCount: 5,
        repoId: "123456789",
    });

    const API_URL = "http://localhost:8800/api";
    //const API_URL = "https://storysurf.website/api/api"

    const getAllRepos = () => {
        axios.get(`${API_URL}/trending`).then((res) => {
            setAllRepos(res.data.data);
            setMessage(res.data.message);
            console.log(res);
        });
    };

    const getOneRepo = () => {
        axios.get(`${API_URL}/trending`).then((res) => {
            setAllRepos(res.data.data);
            setMessage(res.data.message);
            console.log(res);
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
                <b style={{ color: "orange" }}>{"ID: " + item.repoId}</b>
                <a href={item.html_url}>Link to GitHub page</a>
                <p style={{ color: "green" }}>
                    {"Reposytiry: " + item.full_name}
                </p>
            </li>
        );
    });

    const repo = () => {
        if (
            oneRepo &&
            oneRepo?.stargazers_count &&
            oneRepo?.repoId &&
            oneRepo?.full_name &&
            oneRepo?.html_url
        ) {
            return (
                <li className={"li-item"}>
                    <b style={{ fontWeight: "bold", color: "red" }}>
                        {"Stars: " + item.stargazers_count}
                    </b>
                    <b style={{ color: "orange" }}>{"ID: " + item.repoId}</b>
                    <a href={item.html_url}>Link to GitHub page</a>
                    <p style={{ color: "green" }}>
                        {"Reposytiry: " + item.full_name}
                    </p>
                </li>
            );
        }
    };

    return (
        <div className="main-wrapper">
            <div className="main-container">
                <div className="inputs-container">
                    <h2>Repository search Parameters</h2>

                    <h4>Age of searched repositories: </h4>
                    <p> {"- Days: " + inputs.repoMaxAge_d} </p>
                    <input
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
                        name="timerPeriod_h"
                        value={inputs.timerPeriod_h}
                        type="range"
                        onChange={handleInputChange}
                    />
                    <p> {"- Minutes: " + inputs.timerPeriod_m} </p>
                    <input
                        name="timerPeriod_m"
                        value={inputs.timerPeriod_m}
                        type="range"
                        min={0}
                        max={60}
                        onChange={handleInputChange}
                    />
                    <p> {"- Seconds: " + inputs.timerPeriod_s} </p>
                    <input
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

                    <button onClick={getAllRepos}>
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
                    <button onClick={getAllRepos}>
                        Get all repositiries from database
                    </button>
                    <button onClick={getAllRepos}>
                        Refresh database with repositorues from GitHub API
                    </button>
                </div>

                <div className="repos-container">
                    <h2>Result of repository search by ID in database</h2>
                    <ol>{repo}</ol>
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
