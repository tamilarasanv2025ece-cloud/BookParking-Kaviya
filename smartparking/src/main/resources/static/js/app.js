const API = "/api";


/* =========================================================
   COMMON HELPERS
========================================================= */

function showMessage(message) {
    alert(message);
}


function formatDateTime(value) {

    if (!value) {
        return "-";
    }

    try {

        const date = new Date(value);

        if (isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleString();

    } catch (error) {

        return value;
    }
}


function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function statusClass(status) {

    if (!status) {
        return "";
    }

    const value = status.toUpperCase();

    if (value === "AVAILABLE" ||
        value === "CONFIRMED" ||
        value === "COMPLETED" ||
        value === "SUCCESS" ||
        value === "PAID") {

        return "status-available";
    }

    if (value === "CANCELLED" ||
        value === "BOOKED" ||
        value === "FAILED") {

        return "status-booked";
    }

    return "";
}


/* =========================================================
   LOAD PARKING SLOTS
========================================================= */

async function loadParkingSlots() {

    try {

        const response =
            await fetch(`${API}/parking`);


        if (!response.ok) {

            console.error(
                "Unable to load parking slots"
            );

            return;
        }


        const slots =
            await response.json();


        console.log(
            "Parking Slots:",
            slots
        );


        /* =================================================
           TABLE VIEW
        ================================================= */

        const tableBody =
            document.getElementById(
                "parkingTableBody"
            );


        if (tableBody) {

            tableBody.innerHTML = "";


            if (slots.length === 0) {

                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6">
                            No parking slots available.
                        </td>
                    </tr>
                `;

            } else {

                slots.forEach(slot => {

                    const row =
                        document.createElement("tr");


                    const available =
                        String(slot.status || "")
                            .toUpperCase() ===
                        "AVAILABLE";


                    row.innerHTML = `

                        <td>
                            ${escapeHtml(slot.slotId)}
                        </td>

                        <td>
                            ${escapeHtml(slot.slotNumber)}
                        </td>

                        <td>
                            ${escapeHtml(slot.vehicleType)}
                        </td>

                        <td>
                            ${escapeHtml(slot.location)}
                        </td>

                        <td>

                            <span class="status-badge-small
                                ${available
                        ? "status-available"
                        : "status-booked"}">

                                ${escapeHtml(
                        slot.status || "-"
                    )}

                            </span>

                        </td>

                        <td>

                            ${
                        available

                            ?

                            `
                                <a
                                    href="/booking.html?slotId=${slot.slotId}"
                                    class="primary-btn">

                                    Book

                                </a>
                                `

                            :

                            `
                                <button
                                    class="secondary-btn"
                                    disabled>

                                    Booked

                                </button>
                                `
                    }

                        </td>
                    `;


                    tableBody.appendChild(row);

                });
            }
        }


        /* =================================================
           MODERN CARD VIEW
        ================================================= */

        const parkingList =
            document.getElementById(
                "parkingList"
            );


        if (parkingList) {

            parkingList.innerHTML = "";


            if (slots.length === 0) {

                parkingList.innerHTML = `

                    <div class="loading-box">

                        No parking slots available.

                    </div>

                `;

                return;
            }


            slots.forEach(slot => {

                const div =
                    document.createElement("div");


                div.className =
                    "parking-card";


                const available =
                    String(slot.status || "")
                        .toUpperCase() ===
                    "AVAILABLE";


                div.innerHTML = `

                    <div class="parking-card-header">

                        <div>

                            <span
                                style="
                                display:block;
                                color:#9ca3af;
                                font-size:10px;
                                margin-bottom:4px;
                                ">
                                PARKING SLOT
                            </span>

                            <div class="slot-number">

                                ${escapeHtml(
                    slot.slotNumber
                )}

                            </div>

                        </div>


                        <span
                            class="status-badge-small
                            ${
                    available
                        ? "status-available"
                        : "status-booked"
                }">

                            ${
                    available
                        ? "AVAILABLE"
                        : escapeHtml(
                            slot.status || "BOOKED"
                        )
                }

                        </span>

                    </div>


                    <div class="parking-info">

                        <div>
                            📍
                            ${escapeHtml(
                    slot.location || "Not specified"
                )}
                        </div>

                        <div>
                            🚗
                            ${escapeHtml(
                    slot.vehicleType || "Any"
                )}
                        </div>

                        <div>
                            ID:
                            ${escapeHtml(
                    slot.slotId
                )}
                        </div>

                    </div>


                    ${
                    available

                        ?

                        `
                        <a
                            href="/booking.html?slotId=${slot.slotId}"
                            class="parking-book-btn">

                            Book This Slot →

                        </a>
                        `

                        :

                        `
                        <button
                            class="parking-book-btn"
                            disabled
                            style="
                            background:#e5e7eb;
                            color:#9ca3af;
                            cursor:not-allowed;
                            box-shadow:none;">

                            Currently Booked

                        </button>
                        `
                }

                `;


                parkingList.appendChild(div);

            });
        }


    } catch (error) {

        console.error(
            "Parking error:",
            error
        );

    }
}


/* =========================================================
   ADD PARKING SLOT
========================================================= */

async function addParkingSlot(event) {

    event.preventDefault();


    const form =
        event.target;


    const slotNumber =
        form.slotNumber.value.trim();


    const location =
        form.location.value.trim();


    const vehicleType =
        form.vehicleType.value;


    if (!slotNumber ||
        !location ||
        !vehicleType) {

        showMessage(
            "Please fill all fields."
        );

        return;
    }


    const slotData = {

        slotNumber:
        slotNumber,

        location:
        location,

        vehicleType:
        vehicleType,

        status:
            "AVAILABLE"
    };


    try {

        const response =
            await fetch(
                `${API}/parking`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            slotData
                        )
                }
            );


        let result = null;


        try {

            result =
                await response.json();

        } catch (error) {

            result = null;
        }


        if (!response.ok) {

            console.error(
                "Server error:",
                result
            );


            showMessage(
                result?.message ||
                "Failed to add parking slot."
            );

            return;
        }


        showMessage(
            "Parking slot added successfully!"
        );


        form.reset();


        await loadParkingSlots();


    } catch (error) {

        console.error(
            "Add parking slot error:",
            error
        );


        showMessage(
            "Server connection failed. " +
            "Please make sure Spring Boot is running."
        );
    }
}


/* =========================================================
   CREATE BOOKING
========================================================= */

async function createBooking(event) {

    event.preventDefault();


    const form =
        event.target;


    const slotId =
        Number(form.slotId.value);


    const startTime =
        form.startTime.value;


    const endTime =
        form.endTime.value;


    if (!slotId ||
        !startTime ||
        !endTime) {

        showMessage(
            "Please fill all fields."
        );

        return;
    }


    if (
        new Date(endTime) <=
        new Date(startTime)
    ) {

        showMessage(
            "End time must be after start time."
        );

        return;
    }


    /*
        Login is NOT required.
        userId is NOT sent.
    */

    const bookingData = {

        slotId:
        slotId,

        startTime:
        startTime,

        endTime:
        endTime
    };


    try {

        const response =
            await fetch(
                `${API}/bookings`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            bookingData
                        )
                }
            );


        let result = null;


        try {

            result =
                await response.json();

        } catch (error) {

            result = null;
        }


        if (!response.ok) {

            console.error(
                "Booking error:",
                result
            );


            showMessage(
                result?.message ||
                "Booking failed."
            );

            return;
        }


        showMessage(
            "Booking successful!"
        );


        form.reset();


        window.location.href =
            "/dashboard.html";


    } catch (error) {

        console.error(
            "Booking error:",
            error
        );


        showMessage(
            "Server connection failed. " +
            "Please make sure Spring Boot is running."
        );
    }
}


/* =========================================================
   LOAD BOOKINGS
========================================================= */

async function loadBookings() {

    try {

        const response =
            await fetch(
                `${API}/bookings`
            );


        if (!response.ok) {
            return [];
        }


        const bookings =
            await response.json();


        return bookings;


    } catch (error) {

        console.error(
            "Booking loading error:",
            error
        );

        return [];
    }
}


/* =========================================================
   DASHBOARD
========================================================= */

async function loadUserDashboard() {

    try {

        /* =================================================
           PARKING
        ================================================= */

        const parkingResponse =
            await fetch(
                `${API}/parking`
            );


        let slots = [];


        if (parkingResponse.ok) {

            slots =
                await parkingResponse.json();


            const availableSlots =
                slots.filter(
                    slot =>
                        String(
                            slot.status || ""
                        ).toUpperCase() ===
                        "AVAILABLE"
                );


            const parkingCount =
                document.getElementById(
                    "availableParking"
                );


            if (parkingCount) {

                parkingCount.textContent =
                    availableSlots.length;
            }
        }


        /* =================================================
           BOOKINGS
        ================================================= */

        const bookingResponse =
            await fetch(
                `${API}/bookings`
            );


        let bookings = [];


        if (bookingResponse.ok) {

            bookings =
                await bookingResponse.json();


            const bookingCount =
                document.getElementById(
                    "myBookings"
                );


            if (bookingCount) {

                bookingCount.textContent =
                    bookings.length;
            }
        }


        /* =================================================
           PAYMENT COUNT
        ================================================= */

        const paymentResponse =
            await fetch(
                `${API}/payments`
            );


        let payments = [];


        if (paymentResponse.ok) {

            payments =
                await paymentResponse.json();


            const paymentCount =
                document.getElementById(
                    "myPayments"
                );


            if (paymentCount) {

                paymentCount.textContent =
                    payments.length;
            }
        }


        /* =================================================
           PENALTY COUNT
        ================================================= */

        const penaltyResponse =
            await fetch(
                `${API}/overstay`
            );


        let penalties = [];


        if (penaltyResponse.ok) {

            penalties =
                await penaltyResponse.json();


            const penaltyCount =
                document.getElementById(
                    "myPenalties"
                );


            if (penaltyCount) {

                penaltyCount.textContent =
                    penalties.length;
            }
        }


        /* =================================================
           BOOKING DETAILS
        ================================================= */

        renderBookingDetails(
            bookings,
            slots
        );


    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );
    }
}


/* =========================================================
   RENDER BOOKING DETAILS
========================================================= */

function renderBookingDetails(
    bookings,
    slots
) {

    const container =
        document.getElementById(
            "bookingDetails"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!bookings ||
        bookings.length === 0) {

        container.innerHTML = `

            <div class="loading-box">

                <div
                    style="
                    font-size:28px;
                    margin-bottom:10px;">
                    📅
                </div>

                <strong>
                    No bookings yet
                </strong>

                <p
                    style="
                    margin-top:6px;
                    color:#9ca3af;">
                    Your parking bookings will appear here.
                </p>

            </div>

        `;

        return;
    }


    bookings
        .slice()
        .reverse()
        .forEach(booking => {


            const card =
                document.createElement("div");


            card.className =
                "booking-card";


            const slot =
                slots.find(
                    item =>
                        Number(item.slotId) ===
                        Number(booking.slotId)
                );


            const slotNumber =
                slot
                    ? slot.slotNumber
                    : booking.slotId;


            const status =
                booking.status ||
                "CONFIRMED";


            card.innerHTML = `

                <div class="booking-card-header">

                    <div>

                        <span
                            style="
                            display:block;
                            color:#9ca3af;
                            font-size:10px;
                            margin-bottom:4px;">
                            BOOKING
                        </span>

                        <div class="booking-id">

                            #${escapeHtml(
                booking.bookingId
            )}

                        </div>

                    </div>


                    <span
                        class="booking-status">

                        ${escapeHtml(
                status
            )}

                    </span>

                </div>


                <div class="booking-meta">


                    <div>

                        <span>
                            Parking Slot
                        </span>

                        <strong>
                            ${escapeHtml(
                slotNumber
            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Start Time
                        </span>

                        <strong>
                            ${escapeHtml(
                formatDateTime(
                    booking.startTime
                )
            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            End Time
                        </span>

                        <strong>
                            ${escapeHtml(
                formatDateTime(
                    booking.endTime
                )
            )}
                        </strong>

                    </div>


                </div>


                <div
                    style="
                    margin-top:16px;
                    padding-top:12px;
                    border-top:1px solid #e5e7eb;
                    color:#6b7280;
                    font-size:11px;">

                    Booking ID:
                    ${escapeHtml(
                booking.bookingId
            )}

                    &nbsp; • &nbsp;

                    Slot ID:
                    ${escapeHtml(
                booking.slotId
            )}

                </div>

            `;


            container.appendChild(card);

        });
}


/* =========================================================
   CREATE PAYMENT
========================================================= */

async function createPayment(event) {

    event.preventDefault();


    const form =
        event.target;


    /*
        Supports both:
        paymentMode
        paymentMethod
    */

    const bookingElement =
        form.querySelector(
            "#bookingId, [name='bookingId']"
        );


    const amountElement =
        form.querySelector(
            "#amount, [name='amount']"
        );


    const modeElement =
        form.querySelector(
            "#paymentMode, #paymentMethod, [name='paymentMode'], [name='paymentMethod']"
        );


    const transactionElement =
        form.querySelector(
            "#transactionId, [name='transactionId']"
        );


    const bookingId =
        Number(
            bookingElement?.value
        );


    const amount =
        Number(
            amountElement?.value
        );


    const paymentMode =
        modeElement?.value || "UPI";


    const transactionId =
        transactionElement?.value || "";


    if (!bookingId ||
        !amount ||
        amount <= 0) {

        showMessage(
            "Please enter valid booking ID and amount."
        );

        return;
    }


    const payment = {

        bookingId:
        bookingId,

        amount:
        amount,

        paymentMode:
        paymentMode,

        status:
            "PENDING",

        transactionId:
        transactionId
    };


    try {

        const response =
            await fetch(
                `${API}/payments`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            payment
                        )
                }
            );


        let result = null;


        try {

            result =
                await response.json();

        } catch (error) {

            result = null;
        }


        if (!response.ok) {

            showMessage(
                result?.message ||
                "Payment failed."
            );

            return;
        }


        showMessage(
            "Payment created successfully!"
        );


        form.reset();


        window.location.href =
            "/dashboard.html";


    } catch (error) {

        console.error(
            "Payment error:",
            error
        );


        showMessage(
            "Server connection failed."
        );
    }
}


/* =========================================================
   LOAD PAYMENTS
========================================================= */

async function loadPayments() {

    try {

        const response =
            await fetch(
                `${API}/payments`
            );


        if (!response.ok) {
            return;
        }


        const payments =
            await response.json();


        /* =================================================
           TABLE
        ================================================= */

        const tableBody =
            document.getElementById(
                "paymentTableBody"
            );


        if (tableBody) {

            tableBody.innerHTML = "";


            payments.forEach(
                payment => {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>
                            ${escapeHtml(
                        payment.paymentId
                    )}
                        </td>

                        <td>
                            ${escapeHtml(
                        payment.bookingId
                    )}
                        </td>

                        <td>
                            ₹${escapeHtml(
                        payment.amount
                    )}
                        </td>

                        <td>
                            ${escapeHtml(
                        payment.paymentMode
                    )}
                        </td>

                        <td>

                            <span
                                class="status-badge-small
                                ${statusClass(
                        payment.status
                    )}">

                                ${escapeHtml(
                        payment.status
                    )}

                            </span>

                        </td>

                        <td>
                            ${escapeHtml(
                        payment.transactionId || "-"
                    )}
                        </td>

                    `;


                    tableBody.appendChild(row);

                }
            );
        }


        /* =================================================
           MODERN RECORD LIST
        ================================================= */

        const paymentList =
            document.getElementById(
                "paymentList"
            );


        if (paymentList) {

            paymentList.innerHTML = "";


            if (payments.length === 0) {

                paymentList.innerHTML = `

                    <div class="loading-box">
                        No payment records found.
                    </div>

                `;

                return;
            }


            payments
                .slice()
                .reverse()
                .forEach(payment => {

                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "record-card";


                    card.innerHTML = `

                        <div
                            style="
                            display:flex;
                            justify-content:space-between;
                            align-items:center;
                            gap:15px;">

                            <div>

                                <span
                                    style="
                                    color:#9ca3af;
                                    font-size:10px;">
                                    PAYMENT #${escapeHtml(
                        payment.paymentId
                    )}
                                </span>

                                <h3>
                                    Booking #${escapeHtml(
                        payment.bookingId
                    )}
                                </h3>

                            </div>


                            <span
                                class="status-badge-small
                                ${statusClass(
                        payment.status
                    )}">

                                ${escapeHtml(
                        payment.status || "PENDING"
                    )}

                            </span>

                        </div>


                        <p>

                            Amount:
                            <strong>
                                ₹${escapeHtml(
                        payment.amount
                    )}
                            </strong>

                            &nbsp; • &nbsp;

                            Method:
                            ${escapeHtml(
                        payment.paymentMode ||
                        payment.paymentMethod ||
                        "-"
                    )}

                        </p>


                        <p>

                            Transaction:
                            ${escapeHtml(
                        payment.transactionId ||
                        "-"
                    )}

                        </p>

                    `;


                    paymentList.appendChild(
                        card
                    );

                });
        }


    } catch (error) {

        console.error(
            "Payment loading error:",
            error
        );
    }
}


/* =========================================================
   CREATE OVERSTAY PENALTY
========================================================= */

async function createPenalty(event) {

    event.preventDefault();


    const form =
        event.target;


    /*
        Supports different field names.
    */

    const bookingElement =
        form.querySelector(
            "#bookingId, #penaltyBookingId, [name='bookingId']"
        );


    const hoursElement =
        form.querySelector(
            "#overstayHours, [name='overstayHours']"
        );


    const amountElement =
        form.querySelector(
            "#penaltyAmount, [name='penaltyAmount']"
        );


    const reasonElement =
        form.querySelector(
            "#reason, [name='reason']"
        );


    const bookingId =
        Number(
            bookingElement?.value
        );


    const overstayHours =
        Number(
            hoursElement?.value || 0
        );


    const penaltyAmount =
        Number(
            amountElement?.value
        );


    const reason =
        reasonElement?.value?.trim() || "";


    if (!bookingId ||
        !penaltyAmount ||
        penaltyAmount <= 0 ||
        !reason) {

        showMessage(
            "Please fill all penalty details."
        );

        return;
    }


    const penalty = {

        bookingId:
        bookingId,

        overstayHours:
        overstayHours,

        penaltyAmount:
        penaltyAmount,

        status:
            "PENDING",

        reason:
        reason
    };


    try {

        const response =
            await fetch(
                `${API}/overstay`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            penalty
                        )
                }
            );


        let result = null;


        try {

            result =
                await response.json();

        } catch (error) {

            result = null;
        }


        if (!response.ok) {

            showMessage(
                result?.message ||
                "Penalty creation failed."
            );

            return;
        }


        showMessage(
            "Overstay penalty created successfully!"
        );


        form.reset();


        await loadPenalties();


    } catch (error) {

        console.error(
            "Penalty error:",
            error
        );


        showMessage(
            "Server connection failed."
        );
    }
}


/* =========================================================
   LOAD PENALTIES
========================================================= */

async function loadPenalties() {

    try {

        const response =
            await fetch(
                `${API}/overstay`
            );


        if (!response.ok) {
            return;
        }


        const penalties =
            await response.json();


        /* =================================================
           TABLE
        ================================================= */

        const tableBody =
            document.getElementById(
                "penaltyTableBody"
            );


        if (tableBody) {

            tableBody.innerHTML = "";


            penalties.forEach(
                penalty => {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>
                            ${escapeHtml(
                        penalty.penaltyId
                    )}
                        </td>

                        <td>
                            ${escapeHtml(
                        penalty.bookingId
                    )}
                        </td>

                        <td>
                            ${escapeHtml(
                        penalty.overstayHours || 0
                    )}
                        </td>

                        <td>
                            ₹${escapeHtml(
                        penalty.penaltyAmount
                    )}
                        </td>

                        <td>

                            <span
                                class="status-badge-small">

                                ${escapeHtml(
                        penalty.status
                    )}

                            </span>

                        </td>

                        <td>
                            ${escapeHtml(
                        penalty.reason || "-"
                    )}
                        </td>

                    `;


                    tableBody.appendChild(row);

                }
            );
        }


        /* =================================================
           MODERN RECORD LIST
        ================================================= */

        const penaltyList =
            document.getElementById(
                "penaltyList"
            );


        if (penaltyList) {

            penaltyList.innerHTML = "";


            if (penalties.length === 0) {

                penaltyList.innerHTML = `

                    <div class="loading-box">

                        No penalty records found.

                    </div>

                `;

                return;
            }


            penalties
                .slice()
                .reverse()
                .forEach(penalty => {

                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "record-card";


                    card.innerHTML = `

                        <div
                            style="
                            display:flex;
                            justify-content:space-between;
                            align-items:center;
                            gap:15px;">

                            <div>

                                <span
                                    style="
                                    color:#9ca3af;
                                    font-size:10px;">

                                    PENALTY #${escapeHtml(
                        penalty.penaltyId
                    )}

                                </span>


                                <h3>

                                    Booking #${escapeHtml(
                        penalty.bookingId
                    )}

                                </h3>

                            </div>


                            <span
                                class="status-badge-small">

                                ${escapeHtml(
                        penalty.status ||
                        "PENDING"
                    )}

                            </span>

                        </div>


                        <p>

                            Penalty Amount:

                            <strong>
                                ₹${escapeHtml(
                        penalty.penaltyAmount
                    )}
                            </strong>

                        </p>


                        <p>

                            Overstay Hours:
                            ${escapeHtml(
                        penalty.overstayHours || 0
                    )}

                        </p>


                        <p>

                            Reason:
                            ${escapeHtml(
                        penalty.reason || "-"
                    )}

                        </p>

                    `;


                    penaltyList.appendChild(
                        card
                    );

                });
        }


    } catch (error) {

        console.error(
            "Penalty loading error:",
            error
        );
    }
}


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

async function loadAdminDashboard() {

    try {

        const response =
            await fetch(
                `${API}/admin/dashboard`
            );


        if (!response.ok) {
            return;
        }


        const data =
            await response.json();


        const users =
            document.getElementById(
                "totalUsers"
            );


        const bookings =
            document.getElementById(
                "totalBookings"
            );


        const parking =
            document.getElementById(
                "totalParking"
            );


        const payments =
            document.getElementById(
                "totalPayments"
            );


        const penalties =
            document.getElementById(
                "totalPenalties"
            );


        if (users) {

            users.textContent =
                data.totalUsers ?? 0;
        }


        if (bookings) {

            bookings.textContent =
                data.totalBookings ?? 0;
        }


        if (parking) {

            parking.textContent =
                data.totalParkingSlots ?? 0;
        }


        if (payments) {

            payments.textContent =
                data.totalPayments ?? 0;
        }


        if (penalties) {

            penalties.textContent =
                data.totalPenalties ?? 0;
        }


    } catch (error) {

        console.error(
            "Admin dashboard error:",
            error
        );
    }
}


/* =========================================================
   AUTO LOAD EVERYTHING
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
            Parking page
            Admin page
        */
        loadParkingSlots();


        /*
            Payment page
            Dashboard
        */
        loadPayments();


        /*
            Overstay page
            Dashboard
        */
        loadPenalties();


        /*
            Admin dashboard
        */
        loadAdminDashboard();


        /*
            User dashboard
        */
        loadUserDashboard();


        /*
            Booking page:
            Get slotId from URL.

            Example:
            /booking.html?slotId=1
        */

        const params =
            new URLSearchParams(
                window.location.search
            );


        const slotId =
            params.get("slotId");


        const slotInput =
            document.getElementById(
                "slotId"
            );


        if (slotInput && slotId) {

            slotInput.value =
                slotId;
        }

    }
);