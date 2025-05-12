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
    Sitters = "/sitters", // Was /find-sitters

    // Sitter Routes
    SitterDashboard = "/sitter/dashboard",
    SitterBookings = "/sitter/bookings",
    SitterReviews = "/sitter/reviews",
    // SitterProfile = "/sitter/profile", // Merged into /profile

    // Common Routes
    Profile = "/profile",
    PublicSitterReviews = "/sitter-reviews/:sitterId", // For public viewing of sitter reviews

    // Admin routes (example, if needed later)
    // AdminDashboard = "/admin/dashboard",
    // AdminUsers = "/admin/users",
    // AdminBookings = "/admin/bookings",

    // Users page (if kept for admin)
    Users = "/users" // Existing route, might be admin-only
}