// import React from "react";
// import { useController, FieldValues, Control } from "react-hook-form";

// interface InputProps {
//   name: string;
//   id?: string;
//   type?: string;
//   children?: React.ReactNode;
//   control: Control<FieldValues>;
//   placeholder?: string;
// }

// const InputCustom: React.FC<InputProps> = ({
//   name,
//   id,
//   type = "text",
//   children,
//   control,
//   placeholder,
//   ...props
// }) => {
//   const { field } = useController({
//     control,
//     name,
//     defaultValue: "",
//   });

//   return (
//     <div className={`relative w-full ${children ? "has-icon" : ""}`}>
//       <input
//         id={id}
//         type={type}
//         className={`w-full px-4 py-5 rounded-lg font-medium transition-all duration-200 border ${
//           children ? "pr-14" : ""
//         } bg-gray-100 focus:bg-white focus:border-primary outline-none`}
//         {...field}
//         {...props}
//         placeholder={placeholder}
//       />
//       {children && (
//         <div className="absolute transform -translate-y-1/2 cursor-pointer right-5 top-1/2">
//           {children}
//         </div>
//       )}
//     </div>
//   );
// };

// export default InputCustom;

import React from "react";
import { Controller } from "react-hook-form";

type InputCustomProps = {
  name: string;
  control: any;
  children?: React.ReactNode;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  className?: string;
};

const InputCustom: React.FC<InputCustomProps> = ({
  name,
  control,
  placeholder,
  children,
  type = "text",
  autoComplete = "off",
  className,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className={`relative w-max`}>
          <input
            {...field}
            type={type}
            autoComplete={autoComplete}
            placeholder={placeholder}
            className={`w-full px-4 py-5 rounded-lg font-medium transition-all duration-200 border ${className} ${
              children ? "pr-14" : ""
            } bg-gray-100 focus:bg-white focus:border-primary outline-none`}
          >
            {children && (
              <div className="absolute transform -translate-y-1/2 cursor-pointer right-5 top-1/2">
                {children}
              </div>
            )}
          </input>
        </div>
      )}
    />
  );
};

export default InputCustom;
