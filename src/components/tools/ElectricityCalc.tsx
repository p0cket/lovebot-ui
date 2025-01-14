// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Lightbulb, Cpu, Battery, Save, Info, Moon, Sun } from 'lucide-react';
// import { Card, CardHeader, CardContent, CardActions, Typography, Button, TextField, Select, MenuItem, Tooltip, IconButton, Slider } from '@mui/material';

// const ElectricityCalc = () => {
//   const [isDarkMode, setIsDarkMode] = useState(true);

//   useEffect(() => {
//     // Add or remove dark class on body
//     document.documentElement.classList.toggle('dark', isDarkMode);
//     return () => {
//       document.documentElement.classList.remove('dark');
//     };
//   }, [isDarkMode]);

//   const regions = [
//     { name: 'US Average', price: 0.14 },
//     { name: 'California', price: 0.22 },
//     { name: 'New York', price: 0.19 },
//     { name: 'Texas', price: 0.12 },
//     { name: 'Florida', price: 0.13 },
//     { name: 'Washington', price: 0.10 },
//     { name: 'Hawaii', price: 0.33 },
//   ];

//   const commonDevices = [
//     { name: 'Select a device...', amps: 0, volts: 0, hours: 0, days: 0, years: 0 },
//     { name: 'LED Light Bulb', amps: 0.08, volts: 120, hours: 6, days: 365, years: 1 },
//     { name: 'Smartphone Charger', amps: 0.5, volts: 5, hours: 8, days: 365, years: 1 },
//     { name: 'Laptop', amps: 3.5, volts: 20, hours: 8, days: 250, years: 1 },
//     { name: 'Desktop Computer', amps: 2.5, volts: 120, hours: 8, days: 250, years: 1 },
//     { name: 'Television (LED 50")', amps: 1.6, volts: 120, hours: 4, days: 365, years: 1 },
//     { name: 'Refrigerator', amps: 3, volts: 120, hours: 24, days: 365, years: 1 },
//     { name: 'Microwave Oven', amps: 10, volts: 120, hours: 0.5, days: 365, years: 1 },
//     { name: 'Air Conditioner (Window)', amps: 15, volts: 120, hours: 8, days: 120, years: 1 },
//     { name: 'Electric Car Charger', amps: 32, volts: 240, hours: 8, days: 300, years: 1 },
//     { name: 'Gaming Console', amps: 2, volts: 120, hours: 3, days: 365, years: 1 },
//     { name: 'Coffee Maker', amps: 8, volts: 120, hours: 0.25, days: 365, years: 1 },
//     { name: 'Hair Dryer', amps: 10, volts: 120, hours: 0.2, days: 365, years: 1 },
//     { name: 'Electric Kettle', amps: 12, volts: 120, hours: 0.17, days: 365, years: 1 },
//   ];

//   const [values, setValues] = useState({
//     amps: 0,
//     volts: 0,
//     time: 0,
//     pricePerKwh: 0.14
//   });
//   const [savedCalculations, setSavedCalculations] = useState([]);
//   const [label, setLabel] = useState('');

//   const watts = values.amps * values.volts;
//   const totalHours = (values.hours || 0) + 
//                     ((values.days || 0) * 24) + 
//                     ((values.years || 0) * 365 * 24);
//   const totalEnergy = watts * totalHours;
//   const totalKwh = totalEnergy / 1000;
//   const totalCost = totalKwh * values.pricePerKwh;

//   // Function to format cost with appropriate decimal places
//   const formatCost = (cost) => {
//     if (cost === 0) return "$0.00";
//     if (cost < 0.01) return `${cost.toFixed(4)}`;
//     if (cost < 0.1) return `${cost.toFixed(3)}`;
//     return `${cost.toFixed(2)}`;
//   };

//   const maxValues = {
//     amps: 50,    // Most household circuits are 15-20A, but allowing higher for special cases
//     volts: 240,  // Standard US household maximum
//     time: 24,    // Hours in a day
//     pricePerKwh: 0.50  // Higher than typical rates to allow for extreme cases
//   };

//   const descriptions = {
//     amps: {
//       short: "Current flow",
//       long: "Amperage measures the flow rate of electric charge through a circuit. Think of it as the amount of water flowing through a pipe."
//     },
//     volts: {
//       short: "Electrical pressure",
//       long: "Voltage is like water pressure in a pipe - it's the force that pushes electricity through the circuit."
//     },
//     watts: {
//       short: "Power usage",
//       long: "Wattage is the rate at which energy is transferred. It's calculated by multiplying volts by amps."
//     },
//     hours: {
//       short: "Hours per day",
//       long: "Number of hours the device runs per day"
//     },
//     days: {
//       short: "Days per year",
//       long: "Number of days the device runs per year"
//     },
//     years: {
//       short: "Number of years",
//       long: "How many years to calculate the cost for"
//     },
//     pricePerKwh: {
//       short: "Price per kWh",
//       long: "The cost of electricity per kilowatt-hour in your area. This varies by location and provider."
//     }
//   };

//   const getUsageExample = (watts) => {
//     if (watts === 0) return "No power usage";
//     if (watts < 50) return `${Math.round(watts)} watts - Like ${Math.round(watts/10)} LED light bulbs`;
//     if (watts < 500) return `${Math.round(watts)} watts - Similar to a desktop computer`;
//     if (watts < 2000) return `${Math.round(watts)} watts - Like a microwave oven`;
//     return `${Math.round(watts)} watts - Similar to an electric heater`;
//   };

//   const getIcon = (watts) => {
//     if (watts < 100) return <Lightbulb className="text-yellow-500" />;
//     if (watts < 1000) return <Cpu className="text-blue-500" />;
//     return <Battery className="text-red-500" />;
//   };

//   const saveCalculation = () => {
//     if (label.trim()) {
//       setSavedCalculations([
//         ...savedCalculations,
//         {
//           label,
//           amps: values.amps,
//           volts: values.volts,
//           watts,
//           hours: values.hours,
//           days: values.days,
//           years: values.years,
//           totalEnergy,
//           pricePerKwh: values.pricePerKwh,
//           date: new Date().toLocaleString()
//         }
//       ]);
//       setLabel('');
//     }
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
//       <Card className={isDarkMode ? "dark:bg-gray-800" : ""}>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <Typography variant="h5" className={isDarkMode ? "dark:text-white" : ""}>Electricity Usage Calculator</Typography>
//           <IconButton onClick={() => setIsDarkMode(!isDarkMode)}>
//             {isDarkMode ? (
//               <Sun className="h-5 w-5 dark:text-white" />
//             ) : (
//               <Moon className="h-5 w-5" />
//             )}
//           </IconButton>
//         </CardHeader>
//         <CardContent>
//           <div className="grid gap-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//               <Select
//                 onChange={(e) => {
//                   const device = commonDevices.find(d => d.name === e.target.value);
//                   if (device) {
//                     setValues(v => ({
//                       ...v,
//                       amps: device.amps,
//                       volts: device.volts,
//                       hours: device.hours,
//                       days: device.days,
//                       years: device.years
//                     }));
//                   }
//                 }}
//                 displayEmpty
//                 fullWidth
//               >
//                 {commonDevices.map((device) => (
//                   <MenuItem key={device.name} value={device.name}>
//                     {device.name}
//                   </MenuItem>
//                 ))}
//               </Select>

//               <Select
//                 onChange={(e) => {
//                   const saved = savedCalculations.find(calc => calc.label === e.target.value);
//                   if (saved) {
//                     setValues({
//                       amps: saved.amps,
//                       volts: saved.volts,
//                       hours: saved.hours,
//                       days: saved.days,
//                       years: saved.years,
//                       pricePerKwh: saved.pricePerKwh
//                     });
//                   }
//                 }}
//                 displayEmpty
//                 fullWidth
//               >
//                 {savedCalculations.map((calc) => (
//                   <MenuItem key={calc.label} value={calc.label}>
//                     {calc.label}
//                   </MenuItem>
//                 ))}
//               </Select>

//               <Select
//                 onChange={(e) => {
//                   const region = regions.find(r => r.name === e.target.value);
//                   if (region) {
//                     setValues(v => ({
//                       ...v,
//                       pricePerKwh: region.price
//                     }));
//                   }
//                 }}
//                 displayEmpty
//                 fullWidth
//               >
//                 {regions.map((region) => (
//                   <MenuItem key={region.name} value={region.name}>
//                     {region.name} (${region.price}/kWh)
//                   </MenuItem>
//                 ))}
//               </Select>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {Object.entries(descriptions).map(([key, desc]) => (
//                 <div key={key} className="space-y-2">
//                   <Tooltip title={<div><p>{desc.short}</p><p>{desc.long}</p></div>}>
//                     <div className="flex items-center space-x-2">
//                       <Typography variant="body2" className={isDarkMode ? "dark:text-white" : ""}>
//                         {key.charAt(0).toUpperCase() + key.slice(1)}
//                       </Typography>
//                       <Info className="h-4 w-4 dark:text-white" />
//                     </div>
//                   </Tooltip>
//                   <TextField
//                     type="number"
//                     inputProps={{ min: 0, max: key !== 'watts' ? maxValues[key] : undefined }}
//                     value={key === 'watts' ? watts : values[key] || ''}
//                     onChange={(e) => key !== 'watts' && setValues({
//                       ...values,
//                       [key]: parseFloat(e.target.value) || 0
//                     })}
//                     disabled={key === 'watts'}
//                     fullWidth
//                     variant="outlined"
//                     className={isDarkMode ? "dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-2" : "mb-2"}
//                   />
//                   {key !== 'watts' && (
//                     <Slider
//                       value={values[key] || 0}
//                       min={0}
//                       max={maxValues[key]}
//                       step={key === 'pricePerKwh' ? 0.01 : key === 'time' ? 0.5 : 0.1}
//                       onChange={(e, value) => setValues({
//                         ...values,
//                         [key]: value
//                       })}
//                       className={isDarkMode ? "dark:bg-gray-700" : ""}
//                     />
//                   )}
//                 </div>
//               ))}
//             </div>

//             <motion.div
//               className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.5 }}
//             >
//               <AnimatePresence>
//                 {[...Array(Math.min(5, Math.ceil(watts / 20)))].map((_, i) => (
//                   <motion.div
//                     key={i}
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     exit={{ scale: 0 }}
//                     transition={{ delay: i * 0.1 }}
//                   >
//                     {getIcon(watts)}
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//               <div className={isDarkMode ? "dark:text-white" : ""}>
//                 <Typography variant="body2">{getUsageExample(watts)}</Typography>
//                 <div className="mt-2 text-sm">
//                   <Typography variant="body2">Total Energy: {totalKwh.toFixed(3)} kWh</Typography>
//                   <Typography variant="body2">Running time: {totalHours.toFixed(1)} hours ({(totalHours/24).toFixed(1)} days)</Typography>
//                   <Typography variant="body2">Cost: {formatCost(totalCost)}</Typography>
//                 </div>
//               </div>
//             </motion.div>

//             <div className="flex space-x-4">
//               <TextField
//                 type="text"
//                 value={label}
//                 onChange={(e) => setLabel(e.target.value)}
//                 placeholder="Label this calculation"
//                 fullWidth
//                 variant="outlined"
//                 className={isDarkMode ? "dark:bg-gray-700 dark:border-gray-600 dark:text-white" : ""}
//               />
//               <Button
//                 onClick={saveCalculation}
//                 variant="contained"
//                 color="primary"
//                 startIcon={<Save />}
//               >
//                 Save
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {savedCalculations.length > 0 && (
//         <Card className={isDarkMode ? "dark:bg-gray-800" : ""}>
//           <CardHeader>
//             <Typography variant="h5" className={isDarkMode ? "dark:text-white" : ""}>Saved Calculations</Typography>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {savedCalculations.map((calc, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
//                 >
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <Typography variant="body1" className={isDarkMode ? "dark:text-white" : ""}>{calc.label}</Typography>
//                       <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
//                         {calc.watts.toFixed(2)} watts ({calc.amps}A × {calc.volts}V)
//                       </Typography>
//                       <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
//                         Total energy: {(calc.totalEnergy / 1000).toFixed(2)} kWh
//                       </Typography>
//                       <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
//                         Cost: ${((calc.totalEnergy / 1000) * calc.pricePerKwh).toFixed(2)}
//                       </Typography>
//                     </div>
//                     <Typography variant="caption" className="text-gray-500 dark:text-gray-400">{calc.date}</Typography>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default ElectricityCalc;
