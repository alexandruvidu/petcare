/**
 * Application routes defined as constants to be used for routing within the application.
 */
export enum AppRoute {
    // Public Routes
    Index = "/",
    About = "/about",
    Login = "/login",
    Register = "/register",
    PublicSitterReviews = "/sitter-reviews/:sitterId",
    
    // Client Routes
    ClientDashboard = "/client/dashboard",
    ClientPets = "/client/pets",
    ClientBookings = "/client/bookings",
    Sitters = "/sitters",
    
    // Sitter Routes
    SitterDashboard = "/sitter/dashboard",
    SitterBookings = "/sitter/bookings",
    SitterReviews = "/sitter/reviews",
    SitterProfile = "/sitter/profile",
    
    // Common Routes
    Profile = "/profile"
  }