// src/pages/Dashboard.tsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSavedTrips } from "../api/savedTripService";
import { useAuthStore } from "@/store/authStore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  // CardFooter,
} from "@/components/ui/Card";
import { Plane, Calendar, Settings, Clock } from "lucide-react";
import Skeleton from "@/components/Skeleton";

interface Trip {
  id: string;
  title?: string | null;
}

interface User {
  firstName: string | null;
  email: string;
}

const getUserFirstName = (user: User) => user.firstName?.trim() || user.email;

const DashboardSkeleton: React.FC = () => (
  <div className="space-y-10">
    <div className="space-y-1">
      <Skeleton as="span" className="h-8 w-64" />
      <Skeleton as="span" className="h-4 w-80" />
    </div>

    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} variant="shadow">
          <CardContent className="flex items-center justify-between p-6">
            <Skeleton as="span" className="h-8 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="space-y-4">
      <Skeleton as="span" className="h-6 w-32" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} variant="shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <Skeleton as="span" className="h-5 w-32" />
                <Skeleton as="span" className="h-3 w-40 mt-1" />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>

    <div className="space-y-4">
      <Skeleton as="span" className="h-6 w-32" />
      <Card variant="shadow">
        <CardContent className="p-6 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton as="span" key={i} className="h-4 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const { data: trips, isLoading } = useSavedTrips();

  const stats = useMemo(
    () => [
      {
        label: "Saved Trips",
        value: trips?.length ?? 0,
        icon: <Plane className="h-10 w-10 text-blue-500" />,
        bg: "bg-blue-50 dark:bg-blue-900/20",
      },
      {
        label: "Upcoming Flights",
        value: 2, // TODO: dynamic
        icon: <Calendar className="h-10 w-10 text-orange-400" />,
        bg: "bg-orange-50 dark:bg-orange-900/20",
      },
      {
        label: "Notifications",
        value: 0, // TODO: dynamic
        icon: <Settings className="h-10 w-10 text-green-500" />,
        bg: "bg-green-50 dark:bg-green-900/20",
      },
    ],
    [trips]
  );

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

  if (!user) return <p className="p-8">Loading user...</p>;
  if (isLoading) return <DashboardSkeleton />;

  const typedTrips = trips as Trip[] | undefined;

  return (
    <div className="p-8 space-y-10 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-semibold tracking-tight">
          Welcome back, {getUserFirstName(user)}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here’s what’s happening with your trips today.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card
            key={s.label}
            variant="shadow"
            className={`hover:-translate-y-1 transition-transform duration-150 ${s.bg}`}
          >
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {s.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {s.value}
                </p>
              </div>
              <div className="shrink-0">{s.icon}</div>
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
                <Card className="hover:-translate-y-1 hover:shadow-lg transition-transform duration-150">
                  <CardHeader className="flex items-center justify-between pb-2">
                    <div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        {action.description}
                      </CardDescription>
                    </div>
                    <Icon className="h-7 w-7 text-gray-400 dark:text-gray-300 group-hover:text-gray-600 dark:group-hover:text-gray-100 transition-colors" />
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
        <Card variant="shadow" className="hover:-translate-y-1 transition-transform duration-150">
          <CardContent className="space-y-4 p-6 pt-4">
            {typedTrips?.length ? (
              typedTrips.slice(0, 3).map((trip) => (
                <div
                  key={trip.id}
                  className="flex items-center gap-3 border-l-2 border-blue-500 pl-3"
                >
                  <Clock className="h-5 w-5 text-gray-400 dark:text-gray-300" />
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    {`${getUserFirstName(user)} updated trip `}
                    <span className="font-medium">
                      {trip.title || "Untitled Trip"}
                    </span>
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No recent activity yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
