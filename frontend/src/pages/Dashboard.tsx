// src/pages/Dashboard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useSavedTrips } from "../api/savedTripService";
import { useAuthStore } from "@/store/authStore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Plane, Calendar, Settings, Clock } from "lucide-react";
import Skeleton from "@/components/Skeleton";

// Helper to display user's name
const getUserFirstName = (user: {
  firstName: string | null;
  email: string;
}) => {
  const firstName = user.firstName?.trim();
  if (firstName) return firstName;
  return user.email;
};

const Dashboard: React.FC = () => {
  const { data: trips, isLoading } = useSavedTrips();
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  const stats = [
    {
      label: "Saved Trips",
      value: trips?.length ?? 0,
      icon: <Plane className="h-8 w-8 text-blue-500" />,
    },
    {
      label: "Upcoming Flights",
      value: 2,
      icon: <Calendar className="h-8 w-8 text-orange-400" />,
    },
    {
      label: "Notifications",
      value: 0,
      icon: <Settings className="h-8 w-8 text-green-500" />,
    },
  ];

  const quickActions = [
    {
      title: "Saved Trips",
      description: "View and manage itineraries.",
      icon: Plane,
      to: "/saved-trips",
    },
    {
      title: "Upcoming Flights",
      description: "Track future departures.",
      icon: Calendar,
      to: "/flights",
    },
    {
      title: "Account Settings",
      description: "Customize preferences.",
      icon: Settings,
      to: "/profile",
    },
  ];

  return (
    <div className="p-8 space-y-10">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-semibold tracking-tight">
          {isLoading ? (
            <Skeleton as="span" className="h-8 w-64" />
          ) : (
            `Welcome back, ${getUserFirstName(user)}`
          )}
        </h1>
        <div className="text-gray-600">
          {isLoading ? (
            <Skeleton as="span" className="h-4 w-80" />
          ) : (
            "Here’s what’s happening with your trips today."
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card
            key={s.label}
            className="shadow-sm border border-gray-200 hover:shadow-md transition-all"
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{s.label}</p>
                {isLoading ? (
                  <Skeleton as="span" className="h-8 w-20 mt-2" />
                ) : (
                  <p className="text-3xl font-semibold mt-1">{s.value}</p>
                )}
              </div>
              {s.icon}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link to={action.to} key={action.title} className="group">
                <Card className="transition-all shadow-sm border hover:shadow-md hover:-translate-y-1 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle className="text-lg">
                        {isLoading ? (
                          <Skeleton as="span" className="h-5 w-32" />
                        ) : (
                          action.title
                        )}
                      </CardTitle>
                      <CardDescription>
                        {isLoading ? (
                          <Skeleton as="span" className="h-3 w-40 mt-1" />
                        ) : (
                          action.description
                        )}
                      </CardDescription>
                    </div>
                    <Icon className="h-7 w-7 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="p-6 space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton as="span" key={i} className="h-4 w-full" />
                ))}
              </div>
            ) : trips?.length ? (
              trips.slice(0, 3).map((trip, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-gray-700 border-l-2 border-blue-500 pl-2"
                >
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">
                    {`${getUserFirstName(user)} updated trip `}
                    <span className="font-medium">
                      {trip.title || "Untitled Trip"}
                    </span>
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent activity yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
