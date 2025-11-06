import React from 'react';

const colors = ['#00A389', '#3498DB', '#FF5733', '#FFC300', '#DAF7A6', '#C70039', '#58D68D', '#AF7AC5'];

const AvatarWithInitials: React.FC<{ name: string; size?: string }> = ({ name, size = '10' }) => {
    // Generate initials: take the first letter of the first two words (or just the first letter)
    const initials = name 
        ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) 
        : 'AU'; // AU = Anonymous User
    
    // Simple hashing for consistent color based on name's first character
    const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;
    const bgColor = colors[colorIndex];
    
    return (
        <div 
            // Tailwind classes are often fixed values, we use style for dynamic size if needed
            className={`w-${size} h-${size} rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0`}
            style={{ backgroundColor: bgColor }}
        >
            {initials}
        </div>
    );
};
export default AvatarWithInitials;
