import { useNavigate } from "react-router-dom";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import {
  AccountBalance,
  AccountBalanceWallet,
  PersonAdd,
  TrendingUp,
  TrendingDown,
  LockOpen,
  Lock,
} from '@mui/icons-material';
import type { ReactElement } from "react";

interface DashboardItem {
  title: string;
  description: string;
  icon: ReactElement;
  route: string;
  color: string;
}

const DashboardCards = () => {
  const navigate = useNavigate();

  const dashboardItems: DashboardItem[] = [
    {
      title: "Withdrawal",
      description: "Withdraw money from your account",
      icon: <TrendingDown className="text-4xl" />,
      route: "/withdrawal",
      color: "bg-red-100 hover:bg-red-200",
    },
    {
      title: "Deposit",
      description: "Deposit money to your account",
      icon: <TrendingUp className="text-4xl" />,
      route: "/deposit",
      color: "bg-green-100 hover:bg-green-200",
    },
    {
      title: "Account Open",
      description: "Open a new bank account",
      icon: <LockOpen className="text-4xl" />,
      route: "/account/open",
      color: "bg-blue-100 hover:bg-blue-200",
    },
    {
      title: "Account Close",
      description: "Close an existing account",
      icon: <Lock className="text-4xl" />,
      route: "/account/close",
      color: "bg-orange-100 hover:bg-orange-200",
    },
    {
      title: "Transaction",
      description: "View transaction history",
      icon: <AccountBalanceWallet className="text-4xl" />,
      route: "/transactions",
      color: "bg-purple-100 hover:bg-purple-200",
    },
    {
      title: "FD Create",
      description: "Create a Fixed Deposit",
      icon: <AccountBalance className="text-4xl" />,
      route: "/fd/create",
      color: "bg-teal-100 hover:bg-teal-200",
    },
    {
      title: "FD Close",
      description: "Close Fixed Deposit",
      icon: <AccountBalance className="text-4xl" />,
      route: "/fd/close",
      color: "bg-yellow-100 hover:bg-yellow-200",
    },
    {
      title: "Customer Create",
      description: "Add new customer",
      icon: <PersonAdd className="text-4xl" />,
      route: "/customer/create",
      color: "bg-indigo-100 hover:bg-indigo-200",
    },
  ];

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-6">Banking Operations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardItems.map((item, index) => (
          <Card
            key={index}
            className={`transition-all duration-300 hover:shadow-lg ${item.color}`}
            sx={{ 
              maxWidth: 300,
              borderRadius: 2,
              '&:hover': {
                transform: 'translateY(-4px)',
              }
            }}
          >
            <CardActionArea
              onClick={() => handleCardClick(item.route)}
              className="p-4"
            >
              <CardContent className="text-center">
                <div className="flex justify-center mb-3 text-gray-700">
                  {item.icon}
                </div>
                <Typography 
                  gutterBottom 
                  variant="h6" 
                  component="div"
                  className="font-semibold text-gray-800"
                >
                  {item.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  className="text-gray-600"
                >
                  {item.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardCards;
