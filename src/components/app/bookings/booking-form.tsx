'use client';

import React from 'react';
import { BookingTable } from './booking-table';

export default function BookingForm() {
    return (
        <div className="w-full space-y-6">
            <BookingTable />
        </div>
    );
}
