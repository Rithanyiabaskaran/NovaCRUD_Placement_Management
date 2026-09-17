const API = "http://127.0.0.1:8000/api/candidates/";

let data = [];
let editing = null;

const root = document.getElementById("root");


/* =========================
   SECURITY / HTML ESCAPING
========================= */

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (char) {
        const map = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return map[char];
    });
}


/* =========================
   MAIN DASHBOARD
========================= */

function app() {

    root.innerHTML = `
        <div class="app">

            <aside class="side">

                <div class="brand">
                    Nova<span>Place</span>
                </div>

                <div class="nav">

                    <button
                        id="navDashboard"
                        onclick="goDashboard()">
                        ▦ Dashboard
                    </button>

                    <button
                        id="navCandidates"
                        onclick="goCandidates()">
                        🎓 Candidates
                    </button>

                    <button
                        id="navCompanies"
                        onclick="goCompanies()">
                        🏢 Companies
                    </button>

                    <button
                        id="navReports"
                        onclick="goReports()">
                        📈 Reports
                    </button>

                    <button
                        id="navSettings"
                        onclick="goSettings()">
                        ⚙ Settings
                    </button>

                </div>

            </aside>


            <main class="main">

                <div class="top">

                    <div>

                        <div class="eyebrow">
                            PLACEMENT MANAGEMENT
                        </div>

                        <div class="title">
                            Career Command Center
                        </div>

                        <div class="sub">
                            Manage student placements, candidates and companies.
                        </div>

                    </div>


                    <div class="top-actions">

                        <button
                            class="btn secondary"
                            onclick="loadCandidates()">
                            ↻ Refresh
                        </button>

                        <button
                            class="btn primary"
                            onclick="openCandidateForm()">
                            + Add Candidate
                        </button>

                    </div>

                </div>


                <div class="stats">

                    <div class="card stat">

                        <div>
                            <div class="sub">
                                Candidates
                            </div>

                            <strong id="total">
                                0
                            </strong>
                        </div>

                        <div class="ico">
                            🎓
                        </div>

                    </div>


                    <div class="card stat">

                        <div>
                            <div class="sub">
                                Placed
                            </div>

                            <strong id="placed">
                                0
                            </strong>
                        </div>

                        <div class="ico">
                            ✓
                        </div>

                    </div>


                    <div class="card stat">

                        <div>
                            <div class="sub">
                                In Process
                            </div>

                            <strong id="process">
                                0
                            </strong>
                        </div>

                        <div class="ico">
                            ↗
                        </div>

                    </div>


                    <div class="card stat">

                        <div>
                            <div class="sub">
                                Companies
                            </div>

                            <strong id="companies">
                                0
                            </strong>
                        </div>

                        <div class="ico">
                            🏢
                        </div>

                    </div>

                </div>


                <section class="panel">

                    <div class="panel-head">

                        <div>

                            <h2>
                                Candidate Records
                            </h2>

                            <div class="sub">
                                View and manage placement candidates.
                            </div>

                        </div>


                        <input
                            id="search"
                            class="input search"
                            type="text"
                            placeholder="Search candidates..."
                            oninput="renderCandidates()">

                    </div>


                    <div id="table"></div>

                </section>

            </main>

        </div>
    `;
}


/* =========================
   LOAD CANDIDATES FROM API
========================= */

async function loadCandidates() {

    try {

        const response = await fetch(API, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });


        if (!response.ok) {
            throw new Error(
                "API returned HTTP " + response.status
            );
        }


        data = await response.json();


        if (!Array.isArray(data)) {
            data = [];
        }


        renderCandidates();


    } catch (error) {

        console.error("API ERROR:", error);

        data = [];

        renderCandidates();

        toast(
            "Cannot connect to candidate API"
        );
    }
}


/* =========================
   RENDER CANDIDATES
========================= */

function renderCandidates() {

    const table = document.getElementById("table");

    if (!table) {
        return;
    }


    const searchElement =
        document.getElementById("search");


    const searchText =
        searchElement
            ? searchElement.value.toLowerCase().trim()
            : "";


    const rows = data.filter(function (candidate) {

        return Object.values(candidate)
            .join(" ")
            .toLowerCase()
            .includes(searchText);

    });


    updateStatistics();


    if (rows.length === 0) {

        table.innerHTML = `
            <div class="empty">

                No candidate records found.

                <br>

                <button
                    class="btn primary"
                    style="margin-top:14px"
                    onclick="openCandidateForm()">
                    + Add Candidate
                </button>

            </div>
        `;

        return;
    }


    table.innerHTML = `

        <table class="table">

            <thead>

                <tr>

                    <th>Candidate ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>CGPA</th>
                    <th>Company</th>
                    <th>Package</th>
                    <th>Status</th>
                    <th>Actions</th>

                </tr>

            </thead>


            <tbody>

                ${rows.map(function (candidate) {

                    let badgeClass = "notplaced";


                    if (candidate.status === "Placed") {
                        badgeClass = "placed";
                    }

                    if (candidate.status === "In Process") {
                        badgeClass = "process";
                    }


                    return `

                        <tr>

                            <td>
                                <b>
                                    ${escapeHTML(candidate.candidate_id)}
                                </b>
                            </td>


                            <td>
                                ${escapeHTML(candidate.name)}
                            </td>


                            <td>
                                ${escapeHTML(candidate.department)}
                            </td>


                            <td>
                                ${escapeHTML(candidate.cgpa)}
                            </td>


                            <td>
                                ${escapeHTML(candidate.company)}
                            </td>


                            <td>
                                ${escapeHTML(candidate.package_lpa)} LPA
                            </td>


                            <td>

                                <span class="badge ${badgeClass}">
                                    ${escapeHTML(candidate.status)}
                                </span>

                            </td>


                            <td>

                                <div class="actions">

                                    <button
                                        class="btn secondary"
                                        onclick="editCandidate(${candidate.id})">
                                        Edit
                                    </button>


                                    <button
                                        class="btn danger"
                                        onclick="deleteCandidate(${candidate.id})">
                                        Delete
                                    </button>

                                </div>

                            </td>

                        </tr>

                    `;

                }).join("")}

            </tbody>

        </table>
    `;
}


/* =========================
   UPDATE STATISTICS
========================= */

function updateStatistics() {

    const total =
        document.getElementById("total");

    const placed =
        document.getElementById("placed");

    const process =
        document.getElementById("process");

    const companies =
        document.getElementById("companies");


    if (total) {
        total.textContent = data.length;
    }


    if (placed) {

        placed.textContent =
            data.filter(function (candidate) {

                return candidate.status === "Placed";

            }).length;
    }


    if (process) {

        process.textContent =
            data.filter(function (candidate) {

                return candidate.status === "In Process";

            }).length;
    }


    if (companies) {

        companies.textContent =
            new Set(
                data
                    .map(function (candidate) {
                        return candidate.company;
                    })
                    .filter(Boolean)
            ).size;
    }
}


/* =========================
   OPEN ADD CANDIDATE FORM
========================= */

function openCandidateForm(candidate = null) {

    editing = candidate;


    document.body.insertAdjacentHTML(
        "beforeend",
        `

        <div
            class="modal"
            id="candidateModal">

            <div class="box">

                <div class="head">

                    <div>

                        <div class="eyebrow">
                            ${candidate ? "UPDATE" : "CREATE"}
                        </div>

                        <h2 style="margin:4px 0">
                            ${candidate
                                ? "Edit Candidate"
                                : "Add Candidate"}
                        </h2>

                    </div>


                    <button
                        class="close"
                        type="button"
                        onclick="closeCandidateForm()">
                        ×
                    </button>

                </div>


                <form
                    id="candidateForm"
                    onsubmit="saveCandidate(event)">


                    <div class="grid">


                        <div class="field">

                            <label>
                                Candidate ID *
                            </label>

                            <input
                                id="candidateId"
                                class="input"
                                type="text"
                                required
                                value="${escapeHTML(
                                    candidate
                                        ? candidate.candidate_id
                                        : ""
                                )}">

                        </div>


                        <div class="field">

                            <label>
                                Full Name *
                            </label>

                            <input
                                id="candidateName"
                                class="input"
                                type="text"
                                required
                                value="${escapeHTML(
                                    candidate
                                        ? candidate.name
                                        : ""
                                )}">

                        </div>


                        <div class="field">

                            <label>
                                Department *
                            </label>

                            <input
                                id="candidateDepartment"
                                class="input"
                                type="text"
                                required
                                value="${escapeHTML(
                                    candidate
                                        ? candidate.department
                                        : ""
                                )}">

                        </div>


                        <div class="field">

                            <label>
                                CGPA *
                            </label>

                            <input
                                id="candidateCgpa"
                                class="input"
                                type="number"
                                min="0"
                                max="10"
                                step="0.01"
                                required
                                value="${escapeHTML(
                                    candidate
                                        ? candidate.cgpa
                                        : ""
                                )}">

                        </div>


                        <div class="field">

                            <label>
                                Company *
                            </label>

                            <input
                                id="candidateCompany"
                                class="input"
                                type="text"
                                required
                                value="${escapeHTML(
                                    candidate
                                        ? candidate.company
                                        : ""
                                )}">

                        </div>


                        <div class="field">

                            <label>
                                Package (LPA) *
                            </label>

                            <input
                                id="candidatePackage"
                                class="input"
                                type="number"
                                min="0"
                                step="0.01"
                                required
                                value="${escapeHTML(
                                    candidate
                                        ? candidate.package_lpa
                                        : ""
                                )}">

                        </div>


                        <div class="field">

                            <label>
                                Email *
                            </label>

                            <input
                                id="candidateEmail"
                                class="input"
                                type="email"
                                required
                                value="${escapeHTML(
                                    candidate
                                        ? candidate.email
                                        : ""
                                )}">

                        </div>


                        <div class="field">

                            <label>
                                Status *
                            </label>

                            <select
                                id="candidateStatus"
                                class="input"
                                required>


                                <option
                                    value="Placed"
                                    ${candidate &&
                                      candidate.status === "Placed"
                                      ? "selected"
                                      : ""}>
                                    Placed
                                </option>


                                <option
                                    value="In Process"
                                    ${!candidate ||
                                      candidate.status === "In Process"
                                      ? "selected"
                                      : ""}>
                                    In Process
                                </option>


                                <option
                                    value="Not Placed"
                                    ${candidate &&
                                      candidate.status === "Not Placed"
                                      ? "selected"
                                      : ""}>
                                    Not Placed
                                </option>


                            </select>

                        </div>

                    </div>


                    <div
                        style="
                            display:flex;
                            justify-content:flex-end;
                            gap:10px;
                            margin-top:22px;
                        ">


                        <button
                            type="button"
                            class="btn secondary"
                            onclick="closeCandidateForm()">
                            Cancel
                        </button>


                        <button
                            type="submit"
                            class="btn primary">

                            ${candidate
                                ? "Save Changes"
                                : "Create Candidate"}

                        </button>


                    </div>


                </form>

            </div>

        </div>

        `
    );
}


/* =========================
   CLOSE FORM
========================= */

function closeCandidateForm() {

    const modal =
        document.getElementById("candidateModal");


    if (modal) {
        modal.remove();
    }


    editing = null;
}


/* =========================
   SAVE / CREATE / UPDATE
========================= */

async function saveCandidate(event) {

    event.preventDefault();


    const payload = {

        candidate_id:
            document
                .getElementById("candidateId")
                .value
                .trim(),

        name:
            document
                .getElementById("candidateName")
                .value
                .trim(),

        department:
            document
                .getElementById("candidateDepartment")
                .value
                .trim(),

        cgpa:
            document
                .getElementById("candidateCgpa")
                .value,

        company:
            document
                .getElementById("candidateCompany")
                .value
                .trim(),

        package_lpa:
            document
                .getElementById("candidatePackage")
                .value,

        email:
            document
                .getElementById("candidateEmail")
                .value
                .trim(),

        status:
            document
                .getElementById("candidateStatus")
                .value
    };


    console.log("Sending candidate:", payload);


    try {

        const isEditing =
            editing !== null;


        const url =
            isEditing
                ? API + editing.id + "/"
                : API;


        const response =
            await fetch(url, {

                method:
                    isEditing
                        ? "PUT"
                        : "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Accept":
                        "application/json"
                },

                body:
                    JSON.stringify(payload)
            });


        const responseText =
            await response.text();


        let result = {};

        try {

            result =
                responseText
                    ? JSON.parse(responseText)
                    : {};

        } catch (jsonError) {

            result = {};
        }


        console.log(
            "Server response:",
            response.status,
            result
        );


        if (!response.ok) {

            let message =
                "Unable to save candidate";


            if (result) {

                const errors =
                    Object.values(result)
                        .flat()
                        .filter(Boolean);


                if (errors.length > 0) {
                    message =
                        errors.join(" ");
                }
            }


            throw new Error(message);
        }


        const wasEditing =
            isEditing;


        closeCandidateForm();


        await loadCandidates();


        toast(
            wasEditing
                ? "Candidate updated successfully"
                : "Candidate created successfully"
        );


    } catch (error) {

        console.error(
            "SAVE ERROR:",
            error
        );


        toast(
            error.message ||
            "Unable to save candidate"
        );
    }
}


/* =========================
   EDIT
========================= */

function editCandidate(id) {

    const candidate =
        data.find(function (item) {

            return Number(item.id) === Number(id);

        });


    if (!candidate) {

        toast(
            "Candidate not found"
        );

        return;
    }


    openCandidateForm(candidate);
}


/* =========================
   DELETE
========================= */

async function deleteCandidate(id) {

    const confirmed =
        confirm(
            "Delete this candidate permanently?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                API + id + "/",
                {
                    method: "DELETE",
                    headers: {
                        "Accept": "application/json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Delete failed"
            );
        }


        await loadCandidates();


        toast(
            "Candidate deleted successfully"
        );


    } catch (error) {

        console.error(
            "DELETE ERROR:",
            error
        );


        toast(
            "Unable to delete candidate"
        );
    }
}


/* =========================
   DASHBOARD
========================= */

function goDashboard() {

    app();

    setActiveNav("navDashboard");

    loadCandidates();
}


/* =========================
   CANDIDATES
========================= */

function goCandidates() {

    app();

    setActiveNav("navCandidates");

    loadCandidates();
}


/* =========================
   COMPANIES
========================= */

function goCompanies() {

    app();

    setActiveNav("navCompanies");


    const main =
        document.querySelector(".main");


    const companies =
        [
            ...new Set(
                data
                    .map(function (candidate) {
                        return candidate.company;
                    })
                    .filter(Boolean)
            )
        ];


    main.innerHTML = `

        <div class="top">

            <div>

                <div class="eyebrow">
                    PLACEMENT MANAGEMENT
                </div>

                <div class="title">
                    Companies
                </div>

                <div class="sub">
                    Companies participating in student placements.
                </div>

            </div>


            <div class="top-actions">

                <button
                    class="btn primary"
                    onclick="goCandidates()">
                    View Candidates
                </button>

            </div>

        </div>


        <div class="stats">

            <div class="card stat">

                <div>

                    <div class="sub">
                        Total Companies
                    </div>

                    <strong>
                        ${companies.length}
                    </strong>

                </div>

                <div class="ico">
                    🏢
                </div>

            </div>


            <div class="card stat">

                <div>

                    <div class="sub">
                        Candidates
                    </div>

                    <strong>
                        ${data.length}
                    </strong>

                </div>

                <div class="ico">
                    🎓
                </div>

            </div>


            <div class="card stat">

                <div>

                    <div class="sub">
                        Placed
                    </div>

                    <strong>
                        ${
                            data.filter(function (candidate) {
                                return candidate.status === "Placed";
                            }).length
                        }
                    </strong>

                </div>

                <div class="ico">
                    ✓
                </div>

            </div>

        </div>


        <section class="panel">

            <div class="panel-head">

                <div>

                    <h2>
                        Company List
                    </h2>

                    <div class="sub">
                        Companies associated with candidates.
                    </div>

                </div>

            </div>


            <div style="margin-top:20px">

                ${
                    companies.length > 0

                    ?

                    companies.map(function (company) {

                        const count =
                            data.filter(function (candidate) {
                                return candidate.company === company;
                            }).length;


                        return `

                            <div
                                class="card"
                                style="
                                    padding:20px;
                                    margin-bottom:12px;
                                ">

                                <strong>
                                    🏢 ${escapeHTML(company)}
                                </strong>

                                <div
                                    class="sub"
                                    style="margin-top:6px">

                                    ${count}
                                    candidate${count === 1 ? "" : "s"}

                                </div>

                            </div>

                        `;

                    }).join("")


                    :

                    `

                        <div class="empty">

                            No companies found.

                            <br>

                            Add a candidate to create company records.

                        </div>

                    `
                }

            </div>

        </section>

    `;
}


/* =========================
   REPORTS
========================= */

function goReports() {

    app();

    setActiveNav("navReports");


    const total =
        data.length;


    const placed =
        data.filter(function (candidate) {
            return candidate.status === "Placed";
        }).length;


    const processCount =
        data.filter(function (candidate) {
            return candidate.status === "In Process";
        }).length;


    const notPlaced =
        data.filter(function (candidate) {
            return candidate.status === "Not Placed";
        }).length;


    const placementRate =
        total > 0
            ? ((placed / total) * 100).toFixed(1)
            : "0.0";


    const main =
        document.querySelector(".main");


    main.innerHTML = `

        <div class="top">

            <div>

                <div class="eyebrow">
                    PLACEMENT ANALYTICS
                </div>

                <div class="title">
                    Placement Reports
                </div>

                <div class="sub">
                    Analyze candidate placement performance.
                </div>

            </div>

        </div>


        <div class="stats">

            <div class="card stat">

                <div>

                    <div class="sub">
                        Total Candidates
                    </div>

                    <strong>
                        ${total}
                    </strong>

                </div>

                <div class="ico">
                    🎓
                </div>

            </div>


            <div class="card stat">

                <div>

                    <div class="sub">
                        Placed
                    </div>

                    <strong>
                        ${placed}
                    </strong>

                </div>

                <div class="ico">
                    ✓
                </div>

            </div>


            <div class="card stat">

                <div>

                    <div class="sub">
                        In Process
                    </div>

                    <strong>
                        ${processCount}
                    </strong>

                </div>

                <div class="ico">
                    ↗
                </div>

            </div>


            <div class="card stat">

                <div>

                    <div class="sub">
                        Placement Rate
                    </div>

                    <strong>
                        ${placementRate}%
                    </strong>

                </div>

                <div class="ico">
                    📈
                </div>

            </div>

        </div>


        <section class="panel">

            <div class="panel-head">

                <div>

                    <h2>
                        Placement Status
                    </h2>

                    <div class="sub">
                        Current candidate placement distribution.
                    </div>

                </div>

            </div>


            <div style="margin-top:20px">


                <div
                    class="card"
                    style="
                        padding:22px;
                        margin-bottom:12px;
                    ">

                    <strong>
                        ✓ Placed
                    </strong>

                    <span style="float:right">
                        ${placed}
                    </span>

                </div>


                <div
                    class="card"
                    style="
                        padding:22px;
                        margin-bottom:12px;
                    ">

                    <strong>
                        ↗ In Process
                    </strong>

                    <span style="float:right">
                        ${processCount}
                    </span>

                </div>


                <div
                    class="card"
                    style="
                        padding:22px;
                    ">

                    <strong>
                        ○ Not Placed
                    </strong>

                    <span style="float:right">
                        ${notPlaced}
                    </span>

                </div>


            </div>

        </section>

    `;
}


/* =========================
   SETTINGS
========================= */

function goSettings() {

    app();

    setActiveNav("navSettings");


    const main =
        document.querySelector(".main");


    main.innerHTML = `

        <div class="top">

            <div>

                <div class="eyebrow">
                    SYSTEM
                </div>

                <div class="title">
                    Settings
                </div>

                <div class="sub">
                    NovaPlace application information.
                </div>

            </div>

        </div>


        <section class="panel">

            <h2>
                NovaPlace
            </h2>


            <div
                style="
                    display:grid;
                    gap:15px;
                    margin-top:25px;
                ">


                <div
                    class="card"
                    style="padding:20px">

                    <strong>
                        Application
                    </strong>

                    <div
                        class="sub"
                        style="margin-top:6px">

                        NovaPlace Placement Management System

                    </div>

                </div>


                <div
                    class="card"
                    style="padding:20px">

                    <strong>
                        Frontend
                    </strong>

                    <div
                        class="sub"
                        style="margin-top:6px">

                        HTML • CSS • JavaScript

                    </div>

                </div>


                <div
                    class="card"
                    style="padding:20px">

                    <strong>
                        Backend
                    </strong>

                    <div
                        class="sub"
                        style="margin-top:6px">

                        Django REST Framework

                    </div>

                </div>


                <div
                    class="card"
                    style="padding:20px">

                    <strong>
                        Database
                    </strong>

                    <div
                        class="sub"
                        style="margin-top:6px">

                        SQLite

                    </div>

                </div>


            </div>

        </section>

    `;
}


/* =========================
   ACTIVE SIDEBAR
========================= */

function setActiveNav(activeId) {

    const buttons =
        document.querySelectorAll(".nav button");


    buttons.forEach(function (button) {

        button.classList.remove("active");

    });


    const active =
        document.getElementById(activeId);


    if (active) {
        active.classList.add("active");
    }
}


/* =========================
   TOAST MESSAGE
========================= */

function toast(message) {

    const oldToast =
        document.querySelector(".toast");


    if (oldToast) {
        oldToast.remove();
    }


    const element =
        document.createElement("div");


    element.className = "toast";

    element.textContent = message;


    document.body.appendChild(element);


    setTimeout(function () {

        element.remove();

    }, 3000);
}


/* =========================
   START APP
========================= */

app();

loadCandidates();