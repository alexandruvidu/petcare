/**
 * Here you can add more routes as constant to be used for routing within the application.
 */
export enum AppRoute {
    Index = "/",
    About = "/about",
    Login = "/login",
    Register = "/register",

    // Client Routes
    ClientDashboard = "/client/dashboard",
    ClientPets = "/client/pets",
    ClientBookings = "/client/bookings",
    Sitters = "/sitters",

    // Sitter Routes
    SitterDashboard = "/sitter/dashboard",
    SitterBookings = "/sitter/bookings",
    SitterReviews = "/sitter/reviews",

    // Common Routes
    Profile = "/profile",
    PublicSitterReviews = "/sitter-reviews/:sitterId"
}