
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookCopy } from "lucide-react";

interface NavLinksProps {
  isAdmin?: boolean;
  isMobile?: boolean;
}

export const NavLinks = ({ isAdmin, isMobile }: NavLinksProps) => {
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string) =>
    location.pathname === path
      ? "text-primary font-medium"
      : "text-gray-600 hover:text-primary";

  const baseStyles = isMobile
    ? "block px-3 py-2 text-base font-medium"
    : "inline-flex items-center px-1 pt-1";

  return (
    <div className={isMobile ? "space-y-1" : "hidden sm:ml-6 sm:flex sm:space-x-8"}>
      <Link to="/" className={`${baseStyles} ${isActive("/")}`}>
        {t("nav.home")}
      </Link>
      <Link
        to="/how-it-works"
        className={`${baseStyles} ${isActive("/how-it-works")}`}
      >
        {t("nav.howItWorks")}
      </Link>
      {isAdmin && (
        <Link
          to="/admin/books"
          className={`${baseStyles} ${isActive("/admin/books")} space-x-2`}
        >
          <BookCopy className="h-4 w-4 inline-block" />
          <span>{t("admin.booksManagement")}</span>
        </Link>
      )}
    </div>
  );
};
