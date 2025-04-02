// src/components/SlotSelectionGrid.tsx
import React, { useState } from 'react';
import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import { format } from 'date-fns';

interface SlotSelectionGridProps {
  allSlotData: {
    [date: string]: {
      room: string;
      slots: { session: string; isFull: boolean; disabled: boolean }[];
    }[];
  };
  onSlotSelect: (params: { date: string; room: string; session: string }) => void;
  onCancel: () => void;
}

const SlotSelectionGrid: React.FC<SlotSelectionGridProps> = ({
  allSlotData,
  onSlotSelect,
  onCancel,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    room: string;
    session: string;
  } | null>(null);

  const handleConfirm = () => {
    if (selectedSlot) {
      onSlotSelect(selectedSlot); // Call the parent handler
    }
  };

  return (
    <Box>
      {Object.entries(allSlotData).map(([date, rooms]) => (
        <Box key={date} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {format(new Date(date), 'MMMM dd, yyyy')}
          </Typography>
          <Grid container spacing={2}>
            {rooms.map(({ room, slots }) => (
              <Grid item xs={12} sm={6} md={4} key={`${date}-${room}`}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1">{room}</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                    {slots.map(({ session, isFull, disabled }) => {
                      const isSelected =
                        selectedSlot?.date === date &&
                        selectedSlot?.room === room &&
                        selectedSlot?.session === session;

                      return (
                        <Button
  key={session}
  fullWidth
  variant={isSelected ? 'contained' : 'outlined'}
  color={isSelected ? 'primary' : 'inherit'}
  disabled={isFull || disabled}
  onClick={() => setSelectedSlot({ date, room, session })}
>
  {session === "Session 1"
    ? "Session 1 (9:00 AM - 12:00 PM)"
    : session === "Session 2"
    ? "Session 2 (1:00 PM - 4:00 PM)"
    : session}
  {isFull || disabled ? " (Unavailable)" : ""}
</Button>

                      );
                    })}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button onClick={onCancel} sx={{ mr: 2 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!selectedSlot}
          onClick={handleConfirm}
        >
          Confirm Slot
        </Button>
      </Box>
    </Box>
  );
};

export default SlotSelectionGrid;
