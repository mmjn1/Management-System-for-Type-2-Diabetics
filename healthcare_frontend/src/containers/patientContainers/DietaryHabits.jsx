import React, { useState, useEffect } from 'react';
import '../../sass/PatientDashboard.scss';
import { Typography, Grid, IconButton, Button } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PatientSidebar from '../../components/PatientSidebar';

/**
 * `DietaryHabits` manages the dietary habits allows patients to add, edit, and delete food entries for different meals throughout the day,
 * and it stores these entries in localStorage to maintain state across sessions.
 */


const DietaryHabits = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [currentMeal, setCurrentMeal] = useState('');
    const [foodEntry, setFoodEntry] = useState('');
    const [foodEntryError, setFoodEntryError] = useState('');
    const [dietaryAdvice, setDietaryAdvice] = useState('');
    const [currentEntryId, setCurrentEntryId] = useState(null);
    const [dialogMode, setDialogMode] = useState('add');


    /**
     * Formats a JavaScript Date object into a YYYY-MM-DD string.
     * @param {Date} date - The date to format.
     * @returns {string} The formatted date string.
     */
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };


    /**
    * Loads the dietary entries for a given date from localStorage.
    * @param {Date} date - The date for which to load entries.
    * @returns {Object} An object containing arrays of entries for each meal type.
    */
    const loadEntriesForDate = (date) => {
        const dateKey = formatDate(date);
        const savedEntries = localStorage.getItem(`entries_${dateKey}`);
        return savedEntries ? JSON.parse(savedEntries) : {
            Breakfast: [],
            Lunch: [],
            Dinner: [],
            Snacks: []
        };
    };

    const [entries, setEntries] = useState(() => loadEntriesForDate(new Date()));

    // Initializes and updates the entries state whenever the selected date changes.
    useEffect(() => {
        const newEntries = loadEntriesForDate(selectedDate);
        setEntries(newEntries);
    }, [selectedDate]);


    // Function to change the selected date and load entries for the new date
    const changeDate = (offset) => {
        setSelectedDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() + offset);
            return newDate;
        });
    };

    // Saves the current state of entries to localStorage whenever they change.
    useEffect(() => {
        const dateKey = formatDate(selectedDate);
        localStorage.setItem(`entries_${dateKey}`, JSON.stringify(entries));
    }, [entries, selectedDate]);


    const handleClose = () => {
        setOpen(false);
    };

    // Save entries to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('entries', JSON.stringify(entries));
    }, [entries]);

    const updateLocalStorageEntries = (updatedEntries) => {
        const dateKey = formatDate(selectedDate);
        localStorage.setItem(`entries_${dateKey}`, JSON.stringify(updatedEntries));
        setEntries(updatedEntries);
    };


    const saveDietaryAdvice = (meal, food, advice) => {
        setEntries(prevEntries => {
            const updatedEntries = {
                ...prevEntries,
                [meal]: { food, advice }
            };
            // Save updated entries to localStorage
            localStorage.setItem('entries', JSON.stringify(updatedEntries));
            return updatedEntries;
        }); setDietaryAdvice(advice);
    };


    const handleClickOpen = (meal, isEdit = false, index = null) => {
        setCurrentMeal(meal);
        if (isEdit && index !== null) {
            const entry = entries[meal][index];
            setFoodEntry(entry.food);
            setCurrentEntryId(entry.id); // Store the entry ID in state
            setDialogMode('edit');
        } else {
            setFoodEntry('');
            setCurrentEntryId(null); // Reset the entry ID
            setDialogMode('add');
        }
        setOpen(true);
    };

    /**
    * Submits the form for editing an existing entry. Validates the input and updates the entry via an API call.
    */
    const submitEdit = async () => {
        if (!foodEntry.trim()) {
            setFoodEntryError('Food entry cannot be empty.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(`/api/update-entry/${currentEntryId}/`, { user_input: foodEntry }, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });

            const updatedEntry = response.data;

            setEntries(prevEntries => {
                const updatedEntries = {
                    ...prevEntries,
                    [currentMeal]: prevEntries[currentMeal].map(e => e.id === currentEntryId ? { ...e, food: foodEntry, advice: updatedEntry.advice } : e)
                };
                updateLocalStorageEntries(updatedEntries);
                return updatedEntries;
            });

            handleClose();
            setFoodEntryError('');
        } catch (error) {
            console.error('There was an error updating the food entry:', error);
            setFoodEntryError('An error occurred while updating the food entry.');
        }
    };

    // Function to handle deleting a food entry with confirmation
    const handleDelete = async (meal, index) => {
        if (window.confirm('Are you sure you want to delete this food entry?')) {
            const entry = entries[meal][index];

            if (entry && entry.id) {
                try {
                    const token = localStorage.getItem('token');
                    await axios.delete(`/api/delete-entry/${entry.id}/`, {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    });

                    // Update the entries state to remove the food entry from the list
                    setEntries((prevEntries) => {
                        const updatedEntries = {
                            ...prevEntries,
                            [meal]: prevEntries[meal].filter((_, i) => i !== index),
                        };
                        // Save updated entries to localStorage
                        const dateKey = formatDate(selectedDate);
                        localStorage.setItem(`entries_${dateKey}`, JSON.stringify(updatedEntries));
                        return updatedEntries;
                    });
                } catch (error) {
                    console.error('There was an error deleting the food entry:', error);
                }
            } else {
                console.error('No entry ID found for the meal:', meal);
            }
        }
    };

    /**
    * Handles the addition of a new food entry. This function is triggered when the user submits the form to add a new food entry.
    * It performs input validation, makes an API call to create the entry, updates the local state, and handles any errors that occur during the process.
    */
    const handleAddFood = async () => {
        if (!foodEntry.trim()) {
            setFoodEntryError('Food entry cannot be empty.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/create-entry/', { user_input: foodEntry }, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });

            const newEntry = response.data;

            setEntries(prevEntries => {
                const updatedEntries = { ...prevEntries };
                if (!updatedEntries[currentMeal]) {
                    updatedEntries[currentMeal] = [];
                }
                // Directly push the new entry to the current meal array
                updatedEntries[currentMeal].push({
                    id: newEntry.id,
                    food: foodEntry,
                    advice: newEntry.advice
                });

                // Save the updated entries to localStorage
                updateLocalStorageEntries(updatedEntries);
                return updatedEntries;
            });

            // Close the dialog and reset the states
            handleClose();
            setFoodEntry('');
            setFoodEntryError('');
        } catch (error) {
            console.error('There was an error submitting the new food entry:', error);
            setFoodEntryError('An error occurred while submitting the food entry.');
        }
    };



    // Update food entry state when typing in the text field and clear the error if any
    const handleFoodEntryChange = (event) => {
        setFoodEntry(event.target.value);
        // Clear the error message when the user starts typing
        if (foodEntryError) setFoodEntryError('');
    };


    return (
        <div className="dietary-habits-layout">
            {/* <PatientSidebar /> */}

            <main className="main-content">


                <div style={{ backgroundColor: '#eef0f9', padding: '16px' }}>
                    <Typography variant="h5" gutterBottom>
                        Dietary Habits
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        Track and manage your daily food intake to better control your blood sugar levels.
                    </Typography>
                    <Grid container justifyContent="center" alignItems="center" sx={{ my: 2 }}>
                        <IconButton onClick={() => changeDate(-1)} aria-label="Previous day">
                            <ArrowBackIosIcon />
                        </IconButton>
                        <Grid item xs={12} sm={'auto'}>
                            <Typography variant="body1" align="center">
                                {formatDate(selectedDate)}
                            </Typography>
                        </Grid>
                        <IconButton onClick={() => changeDate(1)} aria-label="Next day">
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </Grid>



                    {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((meal) => (
                        <Grid container direction="column" spacing={2} sx={{ mt: 4 }} key={meal}>
                            <Grid item>
                                <Typography variant="h6" component="div">
                                    {meal}
                                </Typography>
                            </Grid>
                            {entries[meal].map((entry, index) => (
                                <React.Fragment key={entry.id}>
                                    <Grid item container direction="row" justifyContent="space-between" alignItems="center">
                                        <Grid item xs={10} sm={10} md={11}>
                                            <TextField
                                                id={`${meal.toLowerCase()}-input-${index}`}
                                                label={meal}
                                                variant="outlined"
                                                value={entry.food || ''}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                sx={{
                                                    m: 1,
                                                    width: '100%',
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={2} sm={2} md={1}>
                                            <IconButton color="primary" aria-label="edit food entry" onClick={() => handleClickOpen(meal, true, index)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="secondary" aria-label="delete food entry" onClick={() => handleDelete(meal, index)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                    {entry.advice && (
                                        <Typography variant="body2" color="textSecondary" sx={{ mt: 2, mb: 1, mx: 1 }}>
                                            {entry.advice}
                                        </Typography>
                                    )}
                                </React.Fragment>
                            ))}
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<AddIcon />}
                                onClick={() => handleClickOpen(meal)}
                                sx={{
                                    bgcolor: 'primary.main',
                                    '&:hover': { bgcolor: 'primary.dark' },
                                    // Adjust width and padding to make the button smaller
                                    maxWidth: '150px', // Set a max width for the button
                                    padding: '4px 8px', // Reduced padding
                                    fontSize: '0.75rem', // Smaller font size
                                }}
                            >
                                ADD FOOD
                            </Button>

                        </Grid>
                    ))}

                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>{dialogMode === 'edit' ? `Edit Food for ${currentMeal}` : `Add Food for ${currentMeal}`}</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="food"
                                label="Food Name"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={foodEntry}
                                onChange={handleFoodEntryChange}
                                error={!!foodEntryError}
                                helperText={foodEntryError}
                                required
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button onClick={dialogMode === 'edit' ? () => submitEdit(currentMeal) : handleAddFood}>
                                {dialogMode === 'edit' ? 'Update' : 'Add'}
                            </Button>
                        </DialogActions>
                    </Dialog>


                </div>
            </main>

        </div>
    );
};

export default DietaryHabits;
