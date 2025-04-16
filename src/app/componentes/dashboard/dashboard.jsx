//Set-ExecutionPolicy Unrestricted -Scope Process
'use client';
import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const dataPie1 = [
  { name: 'Organic Search', value: 20 },
  { name: 'Direct', value: 20 },
  { name: 'Paid Search', value: 20 },
  { name: 'Email', value: 20 },
  { name: 'Referral', value: 20 },
];

const dataPie2 = [
  { name: '1 to 3', value: 8 },
  { name: '4 to 10', value: 10 },
  { name: '11 to 20', value: 12 },
  { name: '21 to 50', value: 30 },
  { name: '51 to 100', value: 40 },
];

const dataBar = [
  { name: 'Jan', Organic: 4000, Paid: 2400, Lost: 2400 },
  { name: 'Feb', Organic: 3000, Paid: 1398, Lost: 2210 },
  { name: 'Mar', Organic: 2000, Paid: 9800, Lost: 2290 },
];

const dataLine = [
  { name: 'Jan', Conversions: 10 },
  { name: 'Feb', Conversions: 15 },
  { name: 'Mar', Conversions: 23 },
];

export default function Dashboard() {
  return (
    <div className="bg-gray-100 p-5 min-h-screen">
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 bg-white shadow rounded p-4 flex flex-col items-center justify-center">
          <p className="text-xl font-semibold">3,009</p>
          <p className="text-gray-500">Facebook Likes</p>
        </div>
        <div className="col-span-2 bg-white shadow rounded p-4 flex flex-col items-center justify-center">
          <PieChart width={300} height={250}>
            <Pie data={dataPie1} innerRadius={50} outerRadius={80} label>
              {dataPie1.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`hsl(${index * 72}, 70%, 50%)`} />
              ))}
            </Pie>
          </PieChart>
          <p className="text-gray-500 mt-2">Website Visitors</p>
        </div>
        <div className="col-span-1 bg-white shadow rounded p-4 flex flex-col items-center justify-center">
          <PieChart width={100} height={100}>
            <Pie data={dataPie2} innerRadius={30} outerRadius={40}>
              {dataPie2.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`hsl(${index * 72}, 70%, 50%)`} />
              ))}
            </Pie>
          </PieChart>
          <p className="text-gray-500">Google Rankings</p>
        </div>

        <div className="col-span-1 bg-white shadow rounded p-4 text-center">
          <p className="text-xl font-semibold">342</p>
          <p className="text-gray-500">YouTube Subscribers</p>
        </div>
        <div className="col-span-2 bg-white shadow rounded p-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dataBar}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Organic" stackId="a" fill="#82ca9d" />
              <Bar dataKey="Paid" stackId="a" fill="#ffc658" />
              <Bar dataKey="Lost" stackId="a" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-center text-gray-500">Audience Growth</p>
        </div>
        <div className="col-span-1 bg-white shadow rounded p-4 flex flex-col items-center justify-center">
          <p className="text-xl font-semibold">25%</p>
          <p className="text-gray-500">Google Rankings</p>
        </div>

        <div className="col-span-1 bg-white shadow rounded p-4 text-center">
          <p className="text-xl font-semibold">143</p>
          <p className="text-gray-500">LinkedIn Followers</p>
        </div>
        <div className="col-span-2 bg-white shadow rounded p-4">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dataLine}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Line type="monotone" dataKey="Conversions" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-center text-gray-500">AdWords Conversions</p>
        </div>
        <div className="col-span-1 bg-white shadow rounded p-4 flex flex-col items-center justify-center">
          <PieChart width={100} height={100}>
            <Pie data={[{ value: 20 }, { value: 30 }]} innerRadius={30} outerRadius={40}>
              <Cell fill="#8884d8" />
              <Cell fill="#d0d0d0" />
            </Pie>
          </PieChart>
          <p className="text-gray-500">Site Audit Score</p>
        </div>
      </div>
    </div>
  );
}
