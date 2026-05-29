document.addEventListener("DOMContentLoaded", () => {
    initializeAgentsPage_();
});

let agentsCache = [];

function initializeAgentsPage_() {
    const form = document.getElementById("agentForm");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            await saveAgent_();
        });
    }

    loadAgents_();
}

async function saveAgent_() {
    const agentId = document.getElementById("agentId").value.trim();

    const payload = {
        action: agentId ? "updateAgent" : "addAgent",
        agentId,
        fullName: document.getElementById("fullName").value.trim(),
        contactNumber: document.getElementById("contactNumber").value.trim(),
        email: document.getElementById("email").value.trim(),
        assignedArea: document.getElementById("assignedArea").value.trim(),
        username: document.getElementById("username").value.trim(),
        password: document.getElementById("password").value.trim(),
        commissionRate: Number(document.getElementById("commissionRate").value || 0),
        agentStatus: document.getElementById("agentStatus").value,
        notes: document.getElementById("notes").value.trim()
    };

    if (!payload.fullName) {
        alert("Please enter agent full name.");
        return;
    }

    try {
        const response = await fetch(API.BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!data.success) {
            alert(data.message || "Failed to save agent.");
            return;
        }

        alert(agentId ? "Agent updated successfully." : "Agent added successfully.");

        resetAgentForm_();
        await loadAgents_();

    } catch (error) {
        console.error("AGENT SAVE ERROR:", error);
        alert("Server error while saving agent: " + error.message);
    }
}

async function loadAgents_() {
    const tbody = document.getElementById("agentsTableBody");

    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9">Loading agents...</td>
            </tr>
        `;
    }

    try {
        const response = await fetch(API.BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({
                action: "getAgents"
            })
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || "Failed to load agents.");
        }

        agentsCache = data.agents || data.rows || [];

        renderAgentsTable_();

    } catch (error) {
        console.error("AGENT LOAD ERROR:", error);

        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9">Failed to load agents: ${error.message}</td>
                </tr>
            `;
        }
    }
}

function renderAgentsTable_() {
    const tbody = document.getElementById("agentsTableBody");
    if (!tbody) return;

    if (!agentsCache.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9">No agents found yet.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = agentsCache.map((agent, index) => {
        return `
            <tr>
                <td>${escapeAgentHTML_(agent.AgentID || "")}</td>
                <td>${escapeAgentHTML_(agent.FullName || "")}</td>
                <td>${escapeAgentHTML_(agent.ContactNumber || "")}</td>
                <td>${escapeAgentHTML_(agent.Email || "")}</td>
                <td>${escapeAgentHTML_(agent.AssignedArea || "")}</td>
                <td>${formatPercent_(agent.CommissionRate)}</td>
                <td>${escapeAgentHTML_(agent.AgentStatus || "")}</td>
                <td>${escapeAgentHTML_(agent.AssignedStoreCount || 0)}</td>
                <td>
                    <button
                        type="button"
                        class="save-btn"
                        onclick="editAgent_(${index})">
                        Edit
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

function editAgent_(index) {
    const agent = agentsCache[index];
    if (!agent) return;

    document.getElementById("agentId").value = agent.AgentID || "";
    document.getElementById("fullName").value = agent.FullName || "";
    document.getElementById("contactNumber").value = agent.ContactNumber || "";
    document.getElementById("email").value = agent.Email || "";
    document.getElementById("assignedArea").value = agent.AssignedArea || "";
    document.getElementById("username").value = agent.Username || "";
    document.getElementById("password").value = agent.Password || "";
    document.getElementById("commissionRate").value = agent.CommissionRate || 0;
    document.getElementById("agentStatus").value = agent.AgentStatus || "Active";
    document.getElementById("notes").value = agent.Notes || "";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function resetAgentForm_() {
    const form = document.getElementById("agentForm");

    if (form) {
        form.reset();
    }

    document.getElementById("agentId").value = "";
    document.getElementById("commissionRate").value = 0;
    document.getElementById("agentStatus").value = "Active";
}

function formatPercent_(value) {
    const num = Number(value || 0);

    return `${num.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}%`;
}

function escapeAgentHTML_(value) {
    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

window.editAgent_ = editAgent_;
window.resetAgentForm_ = resetAgentForm_;