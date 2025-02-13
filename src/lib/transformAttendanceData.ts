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

        // // Convert to Nepal Time (GMT+5:45)
        // checkInDate.setUTCHours(checkInDate.getUTCHours() + 5);
        // checkInDate.setUTCMinutes(checkInDate.getUTCMinutes() + 45);

        // checkOutDate.setUTCHours(checkOutDate.getUTCHours() + 5);
        // checkOutDate.setUTCMinutes(checkOutDate.getUTCMinutes() + 45);

        return {
            id: event._id,
            title: "Worked from " + checkInDate.toUTCString().split(" ")[4] + " to " + checkOutDate.toUTCString().split(" ")[4],
            start: new Date(
                checkInDate.getUTCFullYear(),
                checkInDate.getUTCMonth(),
                checkInDate.getUTCDate(),
                checkInDate.getUTCHours(),
                checkInDate.getUTCMinutes()
            ),
            end: new Date(
                checkOutDate.getUTCFullYear(),
                checkOutDate.getUTCMonth(),
                checkOutDate.getUTCDate(),
                checkOutDate.getUTCHours(),
                checkOutDate.getUTCMinutes()
            ),
        };
    });
};