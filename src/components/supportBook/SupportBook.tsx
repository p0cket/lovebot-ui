import React, { useState } from 'react';
import { 
    MessageCircle, 
    Headphones, 
    Video, 
    Heart, 
    Send, 
    Coffee, 
    Lock, 
    Clock 
} from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';

type AnimationType = 'present' | 'confetti' | 'sparkle';

export interface SupportMessage {
    id: number;
    type: string;
    preview: string;
    content: string;
    sender: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    animation: AnimationType;
}

interface SupportBookProps {
    topic?: string;
    peopleSentSupport?: number;
    messages?: SupportMessage[];
    messagesPerDay?: number;
    demoRefreshTime?: number;
}

const defaultMessages: SupportMessage[] = [
    {
        id: 1,
        type: 'text',
        preview: 'A heartfelt message from Sarah',
        content:
            "Remember that every ending is a new beginning. You're stronger than you know, and this pain will pass. Take it one day at a time.",
        sender: 'Sarah',
        icon: MessageCircle,
        animation: 'present'
    },
    {
        id: 2,
        type: 'audio',
        preview: 'Voice note from Mike',
        content: '🎵 Motivational voice message (Click to play)',
        sender: 'Mike',
        icon: Headphones,
        animation: 'confetti'
    },
    {
        id: 3,
        type: 'video',
        preview: 'Video message from Emma',
        content: '📹 Encouraging video message (Click to play)',
        sender: 'Emma',
        icon: Video,
        animation: 'sparkle'
    },
    {
        id: 4,
        type: 'text',
        preview: "Tomorrow's message from Alex",
        content: "Here's to new beginnings! Your strength inspires those around you.",
        sender: 'Alex',
        icon: MessageCircle,
        animation: 'present'
    },
    {
        id: 5,
        type: 'text',
        preview: 'Future message from Jamie',
        content: 'Every step forward is progress, no matter how small.',
        sender: 'Jamie',
        icon: MessageCircle,
        animation: 'sparkle'
    }
];

const SupportBook: React.FC<SupportBookProps> = ({
    topic = 'Getting Through a Breakup',
    peopleSentSupport = 12,
    messages = defaultMessages,
    messagesPerDay = 2,
    demoRefreshTime = 30
}) => {
    const [revealedMessages, setRevealedMessages] = useState<Set<number>>(new Set());
    const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
    const [messagesOpenedToday, setMessagesOpenedToday] = useState<number>(0);
    const [nextAvailableTime, setNextAvailableTime] = useState<number | null>(null);

    const animations = {
        present: {
            hidden: { scale: 0.8, opacity: 0, rotateY: 90 },
            visible: {
                scale: 1,
                opacity: 1,
                rotateY: 0,
                transition: { type: 'spring', duration: 0.8 }
            }
        },
        confetti: {
            hidden: { scale: 0.8, opacity: 0 },
            visible: {
                scale: 1,
                opacity: 1,
                transition: { type: 'spring', duration: 0.5 }
            }
        },
        sparkle: {
            hidden: { scale: 0, opacity: 0, rotate: -180 },
            visible: {
                scale: 1,
                opacity: 1,
                rotate: 0,
                transition: { type: 'spring', bounce: 0.6, duration: 0.8 }
            }
        }
    };

    const formatTimeRemaining = (seconds: number) => {
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    const TimeCounter: React.FC<{ endTime: number }> = ({ endTime }) => {
        const [timeRemaining, setTimeRemaining] = useState(demoRefreshTime);

        React.useEffect(() => {
            const timer = setInterval(() => {
                const now = new Date().getTime();
                const distance = endTime - now;
                if (distance <= 0) {
                    clearInterval(timer);
                    setMessagesOpenedToday(0);
                    setNextAvailableTime(null);
                } else {
                    setTimeRemaining(Math.ceil(distance / 1000));
                }
            }, 1000);
            return () => clearInterval(timer);
        }, [endTime]);

        return (
            <div className="flex items-center gap-2 text-blue-600">
                <Clock className="w-4 h-4" />
                <span>{formatTimeRemaining(timeRemaining)}</span>
            </div>
        );
    };

    const revealMessage = (id: number) => {
        if (messagesOpenedToday >= messagesPerDay) return;
        setRevealedMessages((prev) => new Set([...prev, id]));
        setMessagesOpenedToday((prev) => prev + 1);
        if (messagesOpenedToday + 1 >= messagesPerDay) {
            const nextTime = new Date();
            nextTime.setSeconds(nextTime.getSeconds() + demoRefreshTime);
            setNextAvailableTime(nextTime.getTime());
        }
    };

    const Confetti: React.FC = () => (
        <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-500 rounded-full"
                    initial={{ opacity: 1, x: '50%', y: '50%' }}
                    animate={{
                        opacity: 0,
                        x: `${50 + (Math.random() - 0.5) * 100}%`,
                        y: `${50 + (Math.random() - 0.5) * 100}%`
                    }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                />
            ))}
        </div>
    );

    const MerchandiseModal: React.FC<{
        message: SupportMessage;
        onClose: () => void;
       
    }> = ({ message, onClose }) => (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-lg p-6 max-w-md w-full"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h3 className="text-xl font-bold mb-4">Get This Message On</h3>
                    <p className="text-gray-600 mb-4">"{message.content}"</p>
                    <p className="text-sm text-gray-500 mb-4">- {message.sender}</p>
                    <div className="space-y-4">
                        <button className="w-full flex items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <Coffee className="w-5 h-5" />
                            <span>Coffee Mug - $14.99</span>
                        </button>
                        <button className="w-full flex items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <MessageCircle className="w-5 h-5" />
                            <span>T-Shirt - $24.99</span>
                        </button>
                        <button className="w-full flex items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <Heart className="w-5 h-5" />
                            <span>Poster - $19.99</span>
                        </button>
                    </div>
                    <button
                        onClick={onClose}
                        className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Close
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold mb-2">Support Book</h1>
                <p className="text-gray-600">Topic: {topic}</p>
                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                        <Heart className="text-red-500" />
                        <span className="text-sm text-gray-600">
                            {peopleSentSupport} people have sent support
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                            Messages available today: {messagesPerDay - messagesOpenedToday}
                        </span>
                        {nextAvailableTime && <TimeCounter endTime={nextAvailableTime} />}
                    </div>
                </div>
            </motion.div>

            <div className="grid gap-4">
                <AnimatePresence>
                    {messages.map((message, index) => {
                        const isLocked =
                            !revealedMessages.has(message.id) &&
                            (messagesOpenedToday >= messagesPerDay || index >= messagesPerDay);

                        return (
                            <Card key={message.id} className="bg-white relative overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <Typography className="text-lg flex items-center gap-2">
                                        <message.icon className="w-5 h-5" />
                                        {message.preview}
                                    </Typography>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {!revealedMessages.has(message.id) ? (
                                            <button
                                                onClick={() => revealMessage(message.id)}
                                                disabled={isLocked}
                                                className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                                                    isLocked
                                                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                                }`}
                                            >
                                                {isLocked ? (
                                                    <>
                                                        <Lock className="w-4 h-4" />
                                                        Available in next refresh
                                                    </>
                                                ) : (
                                                    'Click to reveal this message of support'
                                                )}
                                            </button>
                                        ) : (
                                            <motion.div
                                                variants={animations[message.animation]}
                                                initial="hidden"
                                                animate="visible"
                                                className="space-y-2"
                                            >
                                                {message.animation === 'confetti' && <Confetti />}
                                                <p className="text-gray-700">{message.content}</p>
                                                <p className="text-sm text-gray-500">From: {message.sender}</p>
                                                <button
                                                    onClick={() => setSelectedMessage(message)}
                                                    className="mt-4 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2"
                                                >
                                                    <Coffee className="w-4 h-4" />
                                                    Get this on merchandise
                                                </button>
                                            </motion.div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </AnimatePresence>
            </div>

            <motion.div
                className="mt-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <Card className="bg-gray-50">
                    <CardContent className="pt-6">
                        <button className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <Send className="w-4 h-4" />
                            Send Your Support
                        </button>
                    </CardContent>
                </Card>
            </motion.div>

            <AnimatePresence>
                {selectedMessage && (
                    <MerchandiseModal
                        message={selectedMessage}
                        onClose={() => setSelectedMessage(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default SupportBook;