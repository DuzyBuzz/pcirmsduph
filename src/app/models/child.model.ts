export interface Child {
    id?: string;                         // Child document ID
    userId: string;                      // The parent (user) ID linked to the child
    childNo?: string;                    // Child's number
    familyNo?: string;                   // Family number
    completeAddress?: string;            // Complete address
    childName: string;                   // Child's name
    motherName: string;                  // Mother's name
    motherEducation: string;             // Mother's education level
    motherOccupation: string;            // Mother's occupation
    fatherName: string;                  // Father's name
    fatherEducation: string;             // Father's education level
    fatherOccupation: string;            // Father's occupation
    noOfPregnancies: number;             // Number of pregnancies
    birthDate: string;                   // Child's birth date (ISO string)
    gestationalAge: string;              // Gestational age at birth
    birthType: 'Normal' | 'CS';          // Type of birth
    birthOrder: number;                  // Birth order (1st, 2nd, etc.)
    birthWeight: string;                 // Birth weight
    birthLength: string;                 // Birth length
    placeOfDelivery: 'Home' | 'Lying-in' | 'Hospital' | 'Others'; // Place of delivery
    dateOfBirthRegistration: string;     // Date of birth registration
    birthAttendant: 'Doctor' | 'Midwife' | 'Nurse' | 'Hilot' | 'Others'; // Birth attendant
    otherVaccines?: string;              // Optional field for other vaccines
    gender: string;                      // Child's gender
    // Essential health and nutrition services
    newbornScreening: boolean;           // Newborn screening (after 24 hours)
    bcg: boolean;                        // BCG (at birth)
    dpt: boolean;                        // DPT (6 wks, 10 wks, 14 wks)
    opv: boolean;                        // OPV (6 wks, 10 wks, 14 wks)
    hepatitisB: boolean;                 // Hepatitis B (w/in 24 hrs, 6 wks, 14 wks)
    measles: boolean;                    // Measles (9 months)
    vitaminA: boolean;                   // Vitamin A supplementation
    counseling: boolean;                 // Breastfeeding & Complementary feeding
    growthMonitoring: boolean;           // Growth monitoring
    developmentalScreening: boolean;     // Developmental screening
    deworming: boolean;                  // Deworming (starting at 1 year)
    dentalCheckup: boolean;              // Dental checkup (starting at 2-3 years)
    lu100000: boolean;                   // 100,000 LU (starting at 6 months)
    lu200000: boolean;                   // 200,000 LU (1 year and above)
    medicalNotes?: string;               // Optional medical notes
    guardianName?: string;               // Optional guardian's name (added)
    guardianContact?: string;            // Optional guardian's contact (added)
}