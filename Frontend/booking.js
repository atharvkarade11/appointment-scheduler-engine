// ==========================================
// TEAM A - BOOKING REQUEST
// ==========================================

const API_URL = "http://localhost:3000";


// ==========================================
// GET FORM
// ==========================================

const bookingForm =
    document.getElementById("bookingForm");

const bookingResult =
    document.getElementById("bookingResult");

const resultContent =
    document.getElementById("resultContent");


// ==========================================
// FORM SUBMIT
// ==========================================

bookingForm.addEventListener(
    "submit",
    createBooking
);


// ==========================================
// CREATE BOOKING
// ==========================================

async function createBooking(event) {

    event.preventDefault();


    const userId =
        document.getElementById("userId").value.trim();

    const providerId =
        document.getElementById("providerId").value.trim();

    const serviceType =
        document.getElementById("serviceType").value;

    const duration =
        Number(
            document.getElementById("duration").value
        );

    const priority =
        document.getElementById("priority").value;

    const preferredWindow =
        document.getElementById("preferredWindow").value;


    // ======================================
    // BASIC VALIDATION
    // ======================================

    if (!userId) {

        alert("Please enter Customer / User ID.");

        return;

    }


    if (!serviceType) {

        alert("Please select a service.");

        return;

    }


    // ======================================
    // GENERATE REQUEST ID
    // ======================================

    const requestId =
        "REQ" +
        Date.now();


    // ======================================
    // REQUEST DATA
    // ======================================

    const bookingData = {

        request_id: requestId,

        user_id: userId,

        provider_id: providerId,

        service_type: serviceType,

        duration_minutes: duration,

        priority: priority,

        preferred_window: preferredWindow

    };


    console.log(
        "Sending booking:",
        bookingData
    );


    // ======================================
    // SHOW PROCESSING
    // ======================================

    resultContent.innerHTML = `

        <p>
            Creating booking...
        </p>

    `;


    try {

        // ==================================
        // SEND TO BACKEND
        // ==================================

        const response = await fetch(

            `${API_URL}/api/v1/scheduling/requests`,

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(bookingData)

            }

        );


        const result =
            await response.json();


        console.log(
            "Backend response:",
            result
        );


        // ==================================
        // ERROR
        // ==================================

        if (!response.ok) {

            resultContent.innerHTML = `

                <div class="error">

                    <strong>
                        Booking Failed
                    </strong>

                    <p>
                        ${
                            result.error?.message ||
                            "Unable to create booking."
                        }
                    </p>

                </div>

            `;

            return;

        }


        // ==================================
        // SUCCESS
        // ==================================

        const booking =
            result.data;


        resultContent.innerHTML = `

            <div class="success">

                <h3>
                    Booking Created Successfully ✓
                </h3>

                <p>
                    <strong>Request ID:</strong>
                    ${booking.request_id}
                </p>

                <p>
                    <strong>User:</strong>
                    ${booking.user_id}
                </p>

                <p>
                    <strong>Provider:</strong>
                    ${booking.provider_id}
                </p>

                <p>
                    <strong>Priority:</strong>
                    ${booking.priority}
                </p>

                <p>
                    <strong>Queue Position:</strong>
                    ${booking.queue_position}
                </p>

                <p>
                    <strong>State:</strong>
                    ${booking.state}
                </p>

            </div>

        `;


        // Reset form except provider

        document.getElementById("userId").value = "";

        document.getElementById("serviceType").value = "";

    }

    catch (error) {

        console.error(
            "Connection error:",
            error
        );


        resultContent.innerHTML = `

            <div class="error">

                <strong>
                    Backend Connection Error
                </strong>

                <p>
                    Make sure the Node.js server
                    is running on port 3000.
                </p>

            </div>

        `;

    }

}