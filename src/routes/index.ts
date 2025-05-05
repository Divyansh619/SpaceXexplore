// import { createBrowserRouter, Navigate } from 'react-router-dom';
// import { AppLayout } from '../components/Layout/AppLayout';
// import { ProtectedRoute } from './ProtectedRoute';
// import { AuthPage } from '../pages/auth/AuthPage';
// import { Dashboard } from '../pages/dashboard/Dashboard';
// import { RocketsPage } from '../pages/rockets/RocketsPage';
// import { RocketDetailPage } from '../pages/rockets/RocketDetailPage';
// import { LaunchesPage } from '../pages/launches/LaunchesPage';
// import { LaunchDetailPage } from '../pages/launches/LaunchDetailPage';
// import { StatisticsPage } from '../pages/statistics/StatisticsPage';

// export const router = createBrowserRouter([
//   {
//     path: '/auth',
//     element: <AuthPage />,
//   },
//   {
//     element: <ProtectedRoute />,
//     children: [
//       {
//         element: <AppLayout />,
//         children: [
//           {
//             path: '/',
//             element: <Dashboard />,
//           },
//           {
//             path: '/rockets',
//             element: <RocketsPage />,
//           },
//           {
//             path: '/rockets/:id',
//             element: <RocketDetailPage />,
//           },
//           {
//             path: '/launches',
//             element: <LaunchesPage />,
//           },
//           {
//             path: '/launches/:id',
//             element: <LaunchDetailPage />,
//           },
//           {
//             path: '/statistics',
//             element: <StatisticsPage />,
//           },
//         ],
//       },
//     ],
//   },
//   {
//     path: '*',
//     element: <Navigate to="/" replace />,
//   },
// ]);