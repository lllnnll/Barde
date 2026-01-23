import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import GlassSurface from "../components/GlassSurfaceProps";
import Aurora from "../components/Auror";

const Contact = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const auroraStops = ['#5227FF', '#7CFF67', '#5227FF'];

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            message: "",
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .min(2, "Le nom est trop court")
                .required("Nom requis"),
            email: Yup.string()
                .email("Email invalide")
                .required("Email requis"),
            message: Yup.string()
                .min(10, "Le message doit faire au moins 10 caractères")
                .required("Message requis"),
        }),
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            console.log("Form submitted:", values);
            setIsSubmitted(true);
            setSubmitting(false);
            resetForm();
            setTimeout(() => setIsSubmitted(false), 5000);
        },
    });

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-6 pt-24 overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 -z-10 bg-black">
                <Aurora amplitude={1.0} blend={0.6} colorStops={auroraStops} />
            </div>

            <GlassSurface width={450} height="auto" className="p-8 relative z-10">
                <div className="w-full flex flex-col gap-6">
                    <h1 className="text-3xl font-bold text-white mb-2 text-center">Contactez-nous</h1>

                    {isSubmitted && (
                        <div className="p-4 bg-green-500/20 border border-green-500/50 text-green-300 rounded-lg text-center animate-pulse">
                            Message envoyé avec succès !
                        </div>
                    )}

                    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="name" className="text-sm font-semibold text-white/70 ml-1">Nom</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Votre nom"
                                className={`p-3 rounded-lg bg-white/10 border text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-all ${formik.touched.name && formik.errors.name
                                    ? "border-red-500/50 focus:ring-red-500/20"
                                    : "border-white/10 focus:ring-white/20"
                                    }`}
                                {...formik.getFieldProps("name")}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <p className="text-red-400 text-xs mt-1 ml-1">{formik.errors.name}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="email" className="text-sm font-semibold text-white/70 ml-1">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="votre@email.com"
                                className={`p-3 rounded-lg bg-white/10 border text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-all ${formik.touched.email && formik.errors.email
                                    ? "border-red-500/50 focus:ring-red-500/20"
                                    : "border-white/10 focus:ring-white/20"
                                    }`}
                                {...formik.getFieldProps("email")}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-red-400 text-xs mt-1 ml-1">{formik.errors.email}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="message" className="text-sm font-semibold text-white/70 ml-1">Message</label>
                            <textarea
                                id="message"
                                placeholder="Comment pouvons-nous vous aider ?"
                                rows={4}
                                className={`p-3 rounded-lg bg-white/10 border text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-all resize-none ${formik.touched.message && formik.errors.message
                                    ? "border-red-500/50 focus:ring-red-500/20"
                                    : "border-white/10 focus:ring-white/20"
                                    }`}
                                {...formik.getFieldProps("message")}
                            />
                            {formik.touched.message && formik.errors.message && (
                                <p className="text-red-400 text-xs mt-1 ml-1">{formik.errors.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
                            className={`w-full p-4 rounded-lg font-bold text-white transition-all shadow-lg mt-2 flex items-center justify-center gap-2 ${formik.isValid && formik.dirty && !formik.isSubmitting
                                ? "bg-white/20 hover:bg-white/30 backdrop-blur-md active:scale-95"
                                : "bg-white/5 text-white/30 cursor-not-allowed"
                                }`}
                        >
                            {formik.isSubmitting ? (
                                <>
                                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                                    Envoi en cours...
                                </>
                            ) : (
                                "Envoyer"
                            )}
                        </button>
                    </form>
                </div>
            </GlassSurface>
        </div>
    );
};

export default Contact;
