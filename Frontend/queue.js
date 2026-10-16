// ==========================================
// TEAM A - BOOKING QUEUE
// ==========================================

const API_URL = "http://localhost:3000";


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const providerIdInput =
    document.getElementById("providerId");

const queueTypeSelect =
    document.getElementById("queueType");

const refreshQueueBtn =
    document.getElementById("refreshQueueBtn");

const queueTable =
    document.getElementById("queueTable");

const totalRequests =
    document.getElementById("totalRequests");

const waitingRequests =
    document.getElementById("waitingRequests");

const scheduledRequests =
    document.getElementById("scheduledRequests");


// ==========================================
// REFRESH BUTTON
// ==========================================

refreshQueueBtn.addEventListener(
    "click",
    loadQueue
);


// ==========================================
// LOAD QUEUE
// ==========================================

async function loadQueue() {

    const providerId =
        providerIdInput.value.trim();

    const policy =
        queueTypeSelect.value;


    if (!providerId) {

        alert("Please enter Provider ID.");

        return;

    }


    queueTable.innerHTML = `
        <tr>
            <td colspan="7" class="no-result">
                Loading queue...
            </td>
        </tr>
    `;


    try {

        const response = await fetch(

            `${API_URL}/api/v1/providers/${providerId}/queue?policy=${policy}`

        );


        const result =
            await response.json();


        console.log(
            "Queue response:",
            result
        );


        if (!response.ok) {

            queueTable.innerHTML = `
                <tr>
                    <td colspan="7" class="no-result">
                        Failed to load queue.
                    </td>
                </tr>
            `;

            return;

        }


        const bookings =
            result.data || [];


        // ==================================
        // UPDATE STATISTICS
        // ==================================

        totalRequests.textContent =
            bookings.length;


        const waiting =
            bookings.filter(
                booking =>
                    booking.state === "QUEUED" ||
                    booking.state === "WAITLISTED"
            ).length;


        const scheduled =
            bookings.filter(
                booking =>
                    booking.state === "SCHEDULED"
            ).length;


        waitingRequests.textContent =
            waiting;


        scheduledRequests.textContent =
            scheduled;


        // ==================================
        // DISPLAY BOOKINGS
        // ==================================

        displayQueue(bookings);

    }

    catch (error) {

        console.error(
            "Queue error:",
            error
        );


        queueTable.innerHTML = `
            <tr>
                <td colspan="7" class="no-result">
                    Cannot connect to backend.
                </td>
            </tr>
        `;

    }

}


// ==========================================
// DISPLAY QUEUE
// ==========================================

function displayQueue(bookings) {

    queueTable.innerHTML = "";


    if (!bookings || bookings.length === 0) {

        queueTable.innerHTML = `
            <tr>
                <td colspan="7" class="no-result">
                    No bookings in queue.
                </td>
            </tr>
        `;

        return;

    }


    bookings.forEach(
        (booking) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${booking.queue_position ?? "-"}
                </td>

                <td>
                    ${booking.request_id ?? "-"}
                </td>

                <td>
                    ${booking.user_id ?? "-"}
                </td>

                <td>
                    ${booking.service_type ?? "-"}
                </td>

                <td>
                    ${booking.priority ?? "-"}
                </td>

                <td>
                    ${booking.state ?? "-"}
                </td>

                <td>
                    ${booking.accepted_policy ?? "-"}
                </td>

            `;


            queueTable.appendChild(row);

        }
    );

}


// ==========================================
// LOAD QUEUE WHEN PAGE OPENS
// ==========================================

loadQueue();