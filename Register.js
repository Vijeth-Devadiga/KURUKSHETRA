const form = document.getElementById("registrationForm");
const loader = document.getElementById("loader");
const toast = document.getElementById("toast");
const submitBtn = document.getElementById("submitBtn");

const BACKEND_URL = "https://dhavala.pythonanywhere.com";

const EVENT_REQUIREMENTS = {
    "Dance": { fields: ["dance1", "dance2", "dance3", "dance4", "dance5", "dance6", "dance7"], min: 5, max: 7},
    "Mock Press": { fields: ["mockPress"], min: 1, max: 1 },
    "Quiz": { fields: ["quiz1", "quiz2"], min: 2, max: 2 },
    "Treasure Hunt": { fields: ["treasureHunt"], min: 1, max: 1 },
    "Mad Ad": { fields: ["madAd1", "madAd2", "madAd3", "madAd4", "madAd5", "madAd6"], min: 6, max: 6 },
    "Marketing": { fields: ["marketing1", "marketing2"], min: 2, max: 2 },
    "Bottle Art": { fields: ["bottleArt"], min: 1, max: 1 },
    "Motor Mouth": { fields: ["motorMouth"], min: 1, max: 1 },
    "Best Manager": { fields: ["bestManager"], min: 1, max: 1 },
    "Shark Tank": { fields: ["sharkTank1", "sharkTank2"], min: 2, max: 2 },
    "Mock CID": { fields: ["mockCid1", "mockCid2"], min: 2, max: 2 },
    "Reels Making": { fields: ["reelsMaking"], min: 1, max: 1 }
};

const FIELD_EVENT_MAP = {
    "dance1": "Dance", "dance2": "Dance", "dance3": "Dance", "dance4": "Dance", "dance5": "Dance", "dance6": "Dance", "dance7": "Dance",
    "mockPress": "Mock Press",
    "quiz1": "Quiz", "quiz2": "Quiz",
    "treasureHunt": "Treasure Hunt",
    "madAd1": "Mad Ad", "madAd2": "Mad Ad", "madAd3": "Mad Ad", "madAd4": "Mad Ad", "madAd5": "Mad Ad", "madAd6": "Mad Ad",
    "marketing1": "Marketing", "marketing2": "Marketing",
    "bottleArt": "Bottle Art",
    "motorMouth": "Motor Mouth",
    "bestManager": "Best Manager",
    "sharkTank1": "Shark Tank", "sharkTank2": "Shark Tank",
    "mockCid1": "Mock CID", "mockCid2": "Mock CID",
    "reelsMaking": "Reels Making"
};

function showToast(msg, type = "info") {
    toast.textContent = msg;
    toast.classList.remove("hidden", "error", "success");
    if (type === "error") {
        toast.classList.add("error");    
    }
        
    else{
        toast.classList.add("success");
    }
        
    setTimeout(() => {
        toast.classList.add("hidden");
    }, 4000);
}

function gatherFormData() {
    const payload = {
        collegeName: document.getElementById("collegeName").value.trim(),
        coordinatorName: document.getElementById("coordinatorName").value.trim(),
        coordinatorContact: document.getElementById("coordinatorContact").value.trim(),
    };

    Object.keys(FIELD_EVENT_MAP).forEach(id => {
        const el = document.getElementById(id);
        payload[id] = el ? el.value.trim() : "";
    });

    return payload;
}

function localValidate(payload) {
    const errors = [];

    // Basic validation
    if (!payload.collegeName) errors.push("College name is required.");
    if (!payload.coordinatorName) errors.push("Coordinator name is required.");
    if (!/^\d{10}$/.test(payload.coordinatorContact)) {
        errors.push("Coordinator contact must be a 10-digit number.");
    }

    // Count participants per event
    const eventCounts = {};
    Object.entries(EVENT_REQUIREMENTS).forEach(([eventName, config]) => {
        const count = config.fields.filter(fieldId => payload[fieldId] && payload[fieldId].length > 0).length;
        eventCounts[eventName] = count;
    });

    // Validate each event only if they're participating
    Object.entries(eventCounts).forEach(([eventName, count]) => {
        if (count > 0) {
            const config = EVENT_REQUIREMENTS[eventName];

            if (count < config.min) {
                errors.push(`${eventName} requires at least ${config.min} participant${config.min > 1 ? 's' : ''} (you entered ${count}).`);
            } else if (count > config.max) {
                errors.push(`${eventName} allows maximum ${config.max} participant${config.max > 1 ? 's' : ''} (you entered ${count}).`);
            }
        }
        else{
            
        }
    });

    // Check if at least one event has participants
    const totalParticipants = Object.values(eventCounts).reduce((sum, count) => sum + count, 0);
    if (totalParticipants === 0) {
        errors.push("Please register for at least one event.");
    }

    return errors;
}

async function submitForm(e) {
    e.preventDefault();
    submitBtn.disabled = true;
    loader.classList.remove("hidden");

    const data = gatherFormData();
    const errors = localValidate(data);

    if (errors.length) {
        showToast(errors.join(" "), "error");
        loader.classList.add("hidden");
        submitBtn.disabled = false;
        return;
    }

    try {
        const res = await fetch(`${BACKEND_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const json = await res.json();
        if (!res.ok) {
            if (json && json.errors && Array.isArray(json.errors)) {
                showToast(json.errors.join(" "), "error");
            } else {
                showToast(json.error || "Registration failed", "error");
            }
        } else {
            // showToast(`Success! College ID: ${json.college_id} — Participants: ${json.participants_count}, "success"`);
            showToast(`Thank You, Your Registration is Confirmed!.. We're Exited to Welcome ${json.participants_count} Participants`);
            // alert(`Thank You, your registration is confirmed!.. We're exited to welcome ${json.participants_count} Participants`)
            form.reset();
        }
    } catch (err) {
        console.error("Network error:", err);
        showToast("Network or server error. Check backend URL and CORS settings.", "error");
    } finally {
        loader.classList.add("hidden");
        submitBtn.disabled = false;
    }
}

form.addEventListener("submit", submitForm);