// ==========================================
// TEAM A - SCHEDULER
// ==========================================

const API_URL = "http://localhost:3000";


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const providerIdInput =
    document.getElementById("providerId");

const queueTypeSelect =
    document.getElementById("queueType");

const policySelect =
    document.getElementById("policy");

const runSchedulerBtn =
    document.getElementById("runSchedulerBtn");

const resultMessage =
    document.getElementById("resultMessage");

const resultStatus =
    document.getElementById("resultStatus");

const resultTable =
    document.getElementById("resultTable");


// ==========================================
// RUN SCHEDULER BUTTON
// ==========================================

runSchedulerBtn.addEventListener(
    "click",
    runScheduler
);


// ==========================================
// RUN SCHEDULER
// ==========================================

async function runScheduler() {

    const providerId =
        providerIdInput.value.trim();

    const queueType =
        queueTypeSelect.value;

    const policy =
        policySelect.value;


    // ==========================================
    // VALIDATION
    // ==========================================

    if (!providerId) {

        alert("Please enter Provider ID.");

        return;
    }


    // ==========================================
    // LOADING
    // ==========================================

    resultStatus.textContent =
        "Running";

    resultMessage.textContent =
        "Scheduler is processing the queue...";


    resultTable.innerHTML = `
        <tr>
            <td colspan="7" class="no-result">
                Running scheduler...
            </td>
        </tr>
    `;


    console.log("Provider:", providerId);
    console.log("Queue Type:", queueType);
    console.log("Policy:", policy);


    try {

        // ==========================================
        // STEP 1 - RUN SCHEDULER
        // ==========================================

        const schedulerResponse =
            await fetch(
                `${API_URL}/internal/v1/scheduler/run`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        provider_id:
                            providerId,

                        policy:
                            policy

                    })
                }
            );


        const schedulerResult =
            await schedulerResponse.json();


        console.log(
            "Scheduler Response:",
            schedulerResult
        );


        // ==========================================
        // ERROR
        // ==========================================

        if (!schedulerResponse.ok) {

            resultStatus.textContent =
                "Error";

            resultMessage.textContent =
                schedulerResult.error?.message ||
                "Scheduler failed.";


            resultTable.innerHTML = `
                <tr>
                    <td colspan="7" class="no-result">
                        Scheduler failed.
                    </td>
                </tr>
            `;

            return;
        }


        // ==========================================
        // STEP 2 - GET UPDATED QUEUE
        // ==========================================

        const queueResponse =
            await fetch(
                `${API_URL}/api/v1/providers/${providerId}/queue?policy=${encodeURIComponent(policy)}`
            );


        const queueResult =
            await queueResponse.json();


        console.log(
            "Updated Queue:",
            queueResult
        );


        if (!queueResponse.ok) {

            resultStatus.textContent =
                "Error";

            resultMessage.textContent =
                "Scheduler ran, but queue could not be loaded.";


            resultTable.innerHTML = `
                <tr>
                    <td colspan="7" class="no-result">
                        Unable to load booking list.
                    </td>
                </tr>
            `;

            return;
        }


        // ==========================================
        // GET BOOKINGS FROM RESPONSE
        // ==========================================

        let bookings = [];


        if (Array.isArray(queueResult)) {

            bookings = queueResult;

        }
        else if (
            Array.isArray(queueResult.data)
        ) {

            bookings =
                queueResult.data;

        }
        else if (
            Array.isArray(queueResult.data?.bookings)
        ) {

            bookings =
                queueResult.data.bookings;

        }
        else if (
            Array.isArray(queueResult.bookings)
        ) {

            bookings =
                queueResult.bookings;

        }


        // ==========================================
        // SUCCESS
        // ==========================================

        resultStatus.textContent =
            "Completed";

        resultMessage.textContent =
            `Scheduler completed successfully using ${policy} policy.`;


        // ==========================================
        // DISPLAY BOOKINGS
        // ==========================================

        displayResults(bookings);

    }


    // ==========================================
    // CONNECTION ERROR
    // ==========================================

    catch (error) {

        console.error(
            "Backend connection error:",
            error
        );


        resultStatus.textContent =
            "Offline";


        resultMessage.textContent =
            "Cannot connect to backend.";


        resultTable.innerHTML = `
            <tr>
                <td colspan="7" class="no-result">
                    Make sure Node.js server is running on port 3000.
                </td>
            </tr>
        `;

    }

}


// ==========================================
// DISPLAY RESULTS
// ==========================================

function displayResults(bookings) {

    resultTable.innerHTML = "";


    // ==========================================
    // NO BOOKINGS
    // ==========================================

    if (
        !Array.isArray(bookings) ||
        bookings.length === 0
    ) {

        resultTable.innerHTML = `
            <tr>
                <td colspan="7" class="no-result">
                    No bookings found.
                </td>
            </tr>
        `;

        return;
    }


    // ==========================================
    // DISPLAY EACH BOOKING
    // ==========================================

    bookings.forEach(
        (booking, index) => {

            const row =
                document.createElement("tr");


            // Position
            const position =
                booking.queue_position ??
                booking.position ??
                (index + 1);


            // Scheduled time
            let scheduledTime = "-";


            if (
                booking.estimated_start
            ) {

                scheduledTime =
                    booking.estimated_start;


                if (
                    booking.scheduled_end
                ) {

                    scheduledTime +=
                        ` - ${booking.scheduled_end}`;

                }

            }
            else if (
                booking.scheduled_start
            ) {

                scheduledTime =
                    booking.scheduled_start;


                if (
                    booking.scheduled_end
                ) {

                    scheduledTime +=
                        ` - ${booking.scheduled_end}`;

                }

            }


            row.innerHTML = `

                <td>
                    ${position}
                </td>

                <td>
                    ${booking.request_id ?? "-"}
                </td>

                <td>
                    ${booking.user_id ?? "-"}
                </td>

                <td>
                    ${booking.priority ?? "-"}
                </td>

                <td>
                    ${scheduledTime}
                </td>

                <td>
                    ${booking.state ?? "-"}
                </td>

                <td>
                    ${booking.accepted_policy ?? policySelect.value}
                </td>

            `;


            resultTable.appendChild(row);

        }
    );

}