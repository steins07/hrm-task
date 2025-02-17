export type Attendance = {
    _id: string,
    userId: string,
    checkIn: Date,
    checkOut: Date,
    createdAt?: Date,
    updatedAt?: Date
}

export default function transformAttendanceData(data: Attendance[]) {
    return data.map(event => {
        const checkInDate = new Date(event.checkIn);
        const checkOutDate = new Date(event.checkOut);


        // Convert UTC to local time
        const localCheckInTime = checkInDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        const localCheckOutTime = checkOutDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });


        return {
            id: event._id,
            title: "Worked from " + localCheckInTime + " to " + localCheckOutTime,
            start: new Date(
                checkInDate
            ),
            end: new Date(
                checkOutDate
            ),
        };
    });
};