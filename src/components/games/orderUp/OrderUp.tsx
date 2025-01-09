import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Loader2, Check, X, ChefHat } from 'lucide-react';

const INITIAL_PATIENCE = 20;
const COOKING_TIME = 3;
const MAX_CUSTOMERS = 3;
const GAME_DURATION = 120;
const CUSTOMER_CLEANUP_DELAY = 1000;

const INGREDIENTS = {
    BUN: 'bun',
    PATTY: 'patty',
    LETTUCE: 'lettuce',
    TOMATO: 'tomato',
    CHEESE: 'cheese',
};

const RECIPES: Record<string, string[]> = {
    'Classic Burger': [INGREDIENTS.BUN, INGREDIENTS.PATTY, INGREDIENTS.LETTUCE],
    'Cheeseburger': [INGREDIENTS.BUN, INGREDIENTS.PATTY, INGREDIENTS.CHEESE],
    'Deluxe Burger': [INGREDIENTS.BUN, INGREDIENTS.PATTY, INGREDIENTS.LETTUCE, INGREDIENTS.TOMATO, INGREDIENTS.CHEESE],
};

type CustomerStatus = 'waiting' | 'angry' | 'satisfied';

interface Customer {
    id: number;
    order: string;
    ingredients: string[];
    patience: number;
    status: CustomerStatus;
    statusChangeTime?: number;
}

interface CookingDish {
    ingredients: string[];
    progress: number;
}

export default function BurgerGame() {
    const [score, setScore] = useState<number>(0);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
    const [cookingDish, setCookingDish] = useState<CookingDish | null>(null);
    const [readyDishes, setReadyDishes] = useState<string[][]>([]);
    const [selectedDish, setSelectedDish] = useState<number | null>(null);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [timeRemaining, setTimeRemaining] = useState<number>(GAME_DURATION);

    const generateCustomer = useCallback((): Customer => {
        const recipes = Object.keys(RECIPES);
        const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
        return {
            id: Date.now(),
            order: randomRecipe,
            ingredients: RECIPES[randomRecipe],
            patience: INITIAL_PATIENCE,
            status: 'waiting',
        };
    }, []);

    const startGame = () => {
        setGameStarted(true);
        setScore(0);
        setTimeRemaining(GAME_DURATION);
        setCustomers([generateCustomer()]);
        setSelectedIngredients([]);
        setCookingDish(null);
        setReadyDishes([]);
        setSelectedDish(null);
    };

    useEffect(() => {
        if (!gameStarted || timeRemaining <= 0) return;
        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    setGameStarted(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [gameStarted, timeRemaining]);

    useEffect(() => {
        if (!gameStarted || timeRemaining <= 0) return;
        const interval = setInterval(() => {
            setCustomers((prev) => {
                const waitingCustomers = prev.filter((c) => c.status === 'waiting');
                if (waitingCustomers.length < MAX_CUSTOMERS) {
                    return [...prev, generateCustomer()];
                }
                return prev;
            });
        }, 10000);
        return () => clearInterval(interval);
    }, [gameStarted, generateCustomer, timeRemaining]);

    useEffect(() => {
        if (!gameStarted) return;
        const cleanup = setInterval(() => {
            setCustomers((prev) => {
                return prev.filter(
                    (customer) =>
                        customer.status === 'waiting' ||
                        (customer.status === 'angry' || customer.status === 'satisfied') && Date.now() - (customer.statusChangeTime || 0) < CUSTOMER_CLEANUP_DELAY
                );
            });
        }, 100);
        return () => clearInterval(cleanup);
    }, [gameStarted]);

    useEffect(() => {
        if (!gameStarted || timeRemaining <= 0) return;
        const interval = setInterval(() => {
            setCustomers((prev) =>
                prev.map((customer) => {
                    if (customer.status !== 'waiting') return customer;
                    const newPatience = customer.patience - 0.1;
                    if (newPatience <= 0) {
                        return {
                            ...customer,
                            status: 'angry',
                            patience: 0,
                            statusChangeTime: Date.now(),
                        };
                    }
                    return { ...customer, patience: newPatience };
                })
            );
        }, 100);
        return () => clearInterval(interval);
    }, [gameStarted, timeRemaining]);

    const selectIngredient = (ingredient: string) => {
        if (!gameStarted || timeRemaining <= 0) return;
        setSelectedIngredients((prev) => [...prev, ingredient]);
    };

    const startCooking = () => {
        if (selectedIngredients.length === 0 || !gameStarted || timeRemaining <= 0) return;
        setCookingDish({
            ingredients: [...selectedIngredients],
            progress: 0,
        });
        setSelectedIngredients([]);
    };

    useEffect(() => {
        if (!cookingDish || !gameStarted || timeRemaining <= 0) return;
        const interval = setInterval(() => {
            setCookingDish((prev) => {
                if (!prev) return null;
                const newProgress = prev.progress + 100 / (COOKING_TIME * 10);
                if (newProgress >= 100) {
                    setReadyDishes((ready) => [...ready, prev.ingredients]);
                    return null;
                }
                return { ...prev, progress: newProgress };
            });
        }, 100);
        return () => clearInterval(interval);
    }, [cookingDish, gameStarted, timeRemaining]);

    const selectDishToServe = (dishIndex: number) => {
        if (!gameStarted || timeRemaining <= 0) return;
        setSelectedDish(dishIndex);
    };

    const serveDish = (customerId: number) => {
        if (selectedDish === null || !gameStarted || timeRemaining <= 0) return;
        const dish = readyDishes[selectedDish];
        const customerIndex = customers.findIndex((c) => c.id === customerId);
        if (customerIndex === -1) return;
        const customer = customers[customerIndex];
        const orderIngredients = customer.ingredients;
        const isCorrectOrder =
            dish.length === orderIngredients.length && dish.every((ing) => orderIngredients.includes(ing));
        setCustomers((prev) =>
            prev.map((c) =>
                c.id === customerId
                    ? {
                            ...c,
                            status: isCorrectOrder ? 'satisfied' : 'angry',
                            statusChangeTime: Date.now(),
                        }
                    : c
            )
        );
        if (isCorrectOrder) {
            setScore((prev) => prev + Math.ceil(customer.patience));
        }
        setReadyDishes((prev) => prev.filter((_, i) => i !== selectedDish));
        setSelectedDish(null);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">🍔 Burger Time!</h1>
                {!gameStarted ? (
                    <>
                        {timeRemaining === 0 && <div className="text-2xl font-bold mb-4">Final Score: {score}</div>}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg text-xl"
                            onClick={startGame}
                        >
                            {timeRemaining === GAME_DURATION ? 'Start Game' : 'Play Again'}
                        </motion.button>
                    </>
                ) : (
                    <div className="flex justify-center items-center gap-8">
                        <div className="text-2xl font-bold">Score: {score}</div>
                        <div className="text-2xl font-bold text-blue-600">
                            <Clock className="inline mr-2" />
                            {formatTime(timeRemaining)}
                        </div>
                    </div>
                )}
            </div>

            {gameStarted && (
                <>
                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4">Customers</h2>
                        <div className="flex gap-4">
                            <AnimatePresence>
                                {customers.map((customer) => (
                                    <motion.div
                                        key={customer.id}
                                        initial={{ x: -100, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: 100, opacity: 0 }}
                                        className={`p-4 border rounded-lg flex-1 ${
                                            customer.status === 'angry' ? 'bg-red-100' : customer.status === 'satisfied' ? 'bg-green-100' : 'bg-white'
                                        }`}
                                        onClick={() => serveDish(customer.id)}
                                    >
                                        <div className="text-lg font-bold mb-2">{customer.order}</div>
                                        <div className="text-sm mb-3 text-gray-600">Needs: {customer.ingredients.join(' + ')}</div>
                                        <div className="w-full bg-gray-200 h-2 rounded">
                                            <motion.div
                                                className="bg-blue-500 h-full rounded"
                                                initial={{ width: '100%' }}
                                                animate={{
                                                    width: `${(customer.patience / INITIAL_PATIENCE) * 100}%`,
                                                    backgroundColor: customer.patience < 5 ? '#ef4444' : '#3b82f6',
                                                }}
                                            />
                                        </div>
                                        {customer.status === 'satisfied' && <Check className="text-green-500 mt-2" />}
                                        {customer.status === 'angry' && <X className="text-red-500 mt-2" />}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4">Ingredients</h2>
                        <div className="flex gap-4 mb-4">
                            {Object.values(INGREDIENTS).map((ingredient) => (
                                <motion.button
                                    key={ingredient}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 bg-yellow-100 rounded-lg"
                                    onClick={() => selectIngredient(ingredient)}
                                >
                                    {ingredient}
                                </motion.button>
                            ))}
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="flex gap-2 flex-wrap">
                                {selectedIngredients.map((ingredient, i) => (
                                    <div key={i} className="px-2 py-1 bg-yellow-50 rounded">
                                        {ingredient}
                                    </div>
                                ))}
                            </div>
                            {selectedIngredients.length > 0 && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2"
                                    onClick={startCooking}
                                >
                                    <ChefHat size={20} />
                                    Cook!
                                </motion.button>
                            )}
                        </div>
                    </div>

                    {cookingDish && (
                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-4">Cooking</h2>
                            <div className="w-full bg-gray-200 h-4 rounded">
                                <motion.div
                                    className="bg-green-500 h-full rounded flex items-center justify-center"
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${cookingDish.progress}%` }}
                                >
                                    <Loader2 className="animate-spin text-white" />
                                </motion.div>
                            </div>
                        </div>
                    )}

                    {readyDishes.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">Ready to Serve</h2>
                            <div className="flex gap-4">
                                {readyDishes.map((dish, index) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`px-4 py-2 rounded-lg ${
                                            selectedDish === index ? 'bg-blue-500 text-white' : 'bg-blue-100'
                                        }`}
                                        onClick={() => selectDishToServe(index)}
                                    >
                                        {dish.join(' + ')}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
