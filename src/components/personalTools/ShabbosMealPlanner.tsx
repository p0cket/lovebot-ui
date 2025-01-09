// @ts-nocheck
import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Edit2, Save, X, Share2, Eye, Edit, Trash2 } from 'lucide-react';

const initialMeal = {
    name: '',
    description: '',
    location: '',
    allergies: [],
    notes: '',
    dishes: [],
    published: false
};

function DishRow({ dish, onAssign, isCreator, isEditMode }: any) {
    const [isEditing, setIsEditing] = useState(false);
    const [assignee, setAssignee] = useState(dish.assignedTo || '');
    const [specificDish, setSpecificDish] = useState(dish.specificDish || '');

    const handleAssign = () => {
        onAssign(dish.id, { assignedTo: assignee, specificDish });
        setIsEditing(false);
    };

    return (
        <motion.tr layout initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            <TableCell>{dish.name}</TableCell>
            <TableCell>
                {isEditing ? (
                    <TextField
                        size="small"
                        value={specificDish}
                        onChange={(e) => setSpecificDish(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAssign()}
                        placeholder="Specific dish"
                    />
                ) : (
                    <span>{dish.specificDish || 'Not specified'}</span>
                )}
            </TableCell>
            <TableCell>
                {isEditing ? (
                    <>
                        <TextField
                            size="small"
                            value={assignee}
                            onChange={(e) => setAssignee(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAssign()}
                            placeholder="Your name"
                            style={{ marginRight: 8 }}
                        />
                        <Button onClick={handleAssign} color="success" variant="outlined" size="small">
                            <Save size={16} />
                        </Button>
                        <Button onClick={() => setIsEditing(false)} color="error" variant="outlined" size="small">
                            <X size={16} />
                        </Button>
                    </>
                ) : (
                    <>
                        <span>{dish.assignedTo || 'Open'}</span>
                        {((!dish.assignedTo && !isCreator) || (isCreator && isEditMode)) && (
                            <Button onClick={() => setIsEditing(true)} color="primary" size="small">
                                <Edit2 size={16} />
                            </Button>
                        )}
                    </>
                )}
            </TableCell>
        </motion.tr>
    );
}

export default function ShabbosMealPlanner() {
    const [meal, setMeal] = useState(initialMeal);
    const [newDish, setNewDish] = useState('');
    const [newAllergy, setNewAllergy] = useState('');
    const [isCreator, setIsCreator] = useState(true);
    const [isEditMode, setIsEditMode] = useState(true);
    const [shareUrl, setShareUrl] = useState('');
    const [removeAllergyDialog, setRemoveAllergyDialog] = useState({ open: false, allergy: '' });

    const toggleRole = () => setIsCreator(!isCreator);

    const publishMeal = () => {
        setMeal((prev) => ({ ...prev, published: true }));
        setIsEditMode(false);
        const url = `${window.location.origin}/meal/${Date.now()}`;
        setShareUrl(url);
    };

    const addDish = () => {
        if (newDish.trim()) {
            setMeal((prev) => ({
                ...prev,
                dishes: [...prev.dishes, { id: Date.now(), name: newDish, assignedTo: '', specificDish: '' }]
            }));
            setNewDish('');
        }
    };

    const addAllergy = () => {
        if (newAllergy.trim()) {
            setMeal((prev) => ({ ...prev, allergies: [...prev.allergies, newAllergy] }));
            setNewAllergy('');
        }
    };

    const assignDish = (dishId: number, updates: any) => {
        setMeal((prev) => ({
            ...prev,
            dishes: prev.dishes.map((dish) => (dish.id === dishId ? { ...dish, ...updates } : dish))
        }));
    };

    const handleRemoveAllergy = () => {
        setMeal((prev) => ({
            ...prev,
            allergies: prev.allergies.filter((a) => a !== removeAllergyDialog.allergy)
        }));
        setRemoveAllergyDialog({ open: false, allergy: '' });
    };

    return (
        <Container maxWidth="md">
            <Box mt={4} mb={2} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4">Shabbos Meal Planner</Typography>
                <Box>
                    <Button variant="contained" onClick={toggleRole} style={{ marginRight: 8 }}>
                        {isCreator ? 'Switch to Viewer' : 'Switch to Creator'}
                    </Button>
                    {isCreator && !meal.published && (
                        <Button variant="contained" color="success" onClick={publishMeal}>
                            Publish
                        </Button>
                    )}
                    {isCreator && meal.published && (
                        <Button variant="contained" color="info" onClick={() => setIsEditMode(!isEditMode)}>
                            {isEditMode ? <Eye size={16} /> : <Edit size={16} />}
                            {isEditMode ? ' View' : ' Edit'}
                        </Button>
                    )}
                </Box>
            </Box>

            {shareUrl && (
                <Paper style={{ padding: 8, marginBottom: 16 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography color="primary">{shareUrl}</Typography>
                        <Button onClick={() => navigator.clipboard.writeText(shareUrl)}>
                            <Share2 size={16} />
                        </Button>
                    </Box>
                </Paper>
            )}

            <Paper style={{ padding: 16 }}>
                <TextField
                    label="Meal Name"
                    value={meal.name}
                    onChange={(e) => setMeal((p) => ({ ...p, name: e.target.value }))}
                    fullWidth
                    disabled={!isEditMode || !isCreator}
                    style={{ marginBottom: 16 }}
                />
                <TextField
                    label="Description"
                    value={meal.description}
                    onChange={(e) => setMeal((p) => ({ ...p, description: e.target.value }))}
                    fullWidth
                    disabled={!isEditMode || !isCreator}
                    multiline
                    rows={3}
                    style={{ marginBottom: 16 }}
                />
                <TextField
                    label="Location"
                    value={meal.location}
                    onChange={(e) => setMeal((p) => ({ ...p, location: e.target.value }))}
                    fullWidth
                    disabled={!isEditMode || !isCreator}
                    style={{ marginBottom: 16 }}
                />

                {/* Allergies */}
                <Typography variant="h6">Allergies</Typography>
                {(isEditMode || !meal.published) && (
                    <Box display="flex" gap={2} mt={1} mb={2}>
                        <TextField
                            label="Add Allergy"
                            value={newAllergy}
                            onChange={(e) => setNewAllergy(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
                            fullWidth
                        />
                        <Button variant="contained" color="primary" onClick={addAllergy}>
                            <PlusCircle size={16} />
                        </Button>
                    </Box>
                )}
                <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                    <AnimatePresence>
                        {meal.allergies.map((allergy) => (
                            <motion.div
                                key={allergy}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '4px 8px', borderRadius: 16 }}
                            >
                                {allergy}
                                <Button
                                    size="small"
                                    onClick={() => setRemoveAllergyDialog({ open: true, allergy })}
                                    style={{ minWidth: 'auto', color: '#c62828', padding: 0, marginLeft: 8 }}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </Box>

                {/* Dishes */}
                <Typography variant="h6">Dishes</Typography>
                {isEditMode && isCreator && (
                    <Box display="flex" gap={2} mt={2} mb={2}>
                        <TextField
                            label="Add Dish Type"
                            value={newDish}
                            onChange={(e) => setNewDish(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addDish()}
                            fullWidth
                        />
                        <Button variant="contained" color="success" onClick={addDish}>
                            <PlusCircle size={16} />
                        </Button>
                    </Box>
                )}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Dish Type</TableCell>
                                <TableCell>Specific Dish</TableCell>
                                <TableCell>Assigned To</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <AnimatePresence>
                                {meal.dishes.map((dish) => (
                                    <DishRow
                                        key={dish.id}
                                        dish={dish}
                                        onAssign={assignDish}
                                        isCreator={isCreator}
                                        isEditMode={isEditMode}
                                    />
                                ))}
                            </AnimatePresence>
                        </TableBody>
                    </Table>
                </TableContainer>

                <TextField
                    label="Additional Notes"
                    value={meal.notes}
                    onChange={(e) => setMeal((p) => ({ ...p, notes: e.target.value }))}
                    fullWidth
                    multiline
                    rows={3}
                    disabled={!isEditMode || !isCreator}
                    style={{ marginTop: 16 }}
                />
            </Paper>

            {/* Dialog for removing allergies */}
            <Dialog open={removeAllergyDialog.open} onClose={() => setRemoveAllergyDialog({ open: false, allergy: '' })}>
                <DialogTitle>Remove Allergy</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to remove {removeAllergyDialog.allergy}? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRemoveAllergyDialog({ open: false, allergy: '' })}>Cancel</Button>
                    <Button onClick={handleRemoveAllergy} color="error">
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
