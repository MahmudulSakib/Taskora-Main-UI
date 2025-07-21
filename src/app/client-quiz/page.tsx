"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import NavMenu from "@/components/Navmenu";
import useClientAuth from "@/hooks/useClientAuth";
import { useRouter } from "next/navigation";
import { Alert } from "@mui/material";

export default function ClientQuizPage() {
  const router = useRouter();
  const { user, loading } = useClientAuth();
  const [quiz, setQuiz] = useState<any>(null);
  const [answer, setAnswer] = useState("");
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [uploadMessages, setUploadMessages] = useState("");
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/log-in");
    }
  }, [loading, user, router]);

  useEffect(() => {
    axios
      .get<any>("https://taskora-main-backend.onrender.com/client/quiz-today", {
        withCredentials: true,
      })
      .then((res) => {
        // Backend sends: { quiz, alreadySubmitted, selectedAnswer }
        setQuiz(res.data.quiz);
        if (res.data.alreadySubmitted) {
          setAlreadySubmitted(true);
          setAnswer(res.data.selectedAnswer); // mark selected
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSubmit = async () => {
    try {
      await axios.post(
        "https://taskora-main-backend.onrender.com/client/submit-quiz",
        {
          quizId: quiz.id,
          selectedAnswer: answer,
        },
        { withCredentials: true }
      );
      setUploadMessages("Answer successfully submitted!");
      setToastOpen(true);
      setAlreadySubmitted(true); // permanently disable after submission
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to submit");
    }
  };

  if (!quiz)
    return (
      <Typography
        textAlign="center"
        mt={10}
        color="white"
        sx={{
          background:
            "linear-gradient(to right, rgba(6, 22, 40, 0.7), rgba(59, 90, 112, 0.7))",
        }}
      >
        No quiz available today
      </Typography>
    );

  return (
    <>
      <div>
        <NavMenu />
      </div>
      <Box
        sx={{
          minHeight: "90vh",
          background:
            "linear-gradient(to right, rgba(6, 22, 40, 0.7), rgba(59, 90, 112, 0.7))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Card
          sx={{
            maxWidth: 500,
            width: "100%",
            bgcolor: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            color: "#fff",
            boxShadow: 6,
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              {quiz.question}
            </Typography>

            <FormControl component="fieldset" sx={{ color: "#fff" }}>
              <RadioGroup
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                name="quiz-options"
              >
                <FormControlLabel
                  value="A"
                  control={<Radio sx={{ color: "#fff" }} />}
                  label={quiz.optionA}
                  disabled={alreadySubmitted}
                />
                <FormControlLabel
                  value="B"
                  control={<Radio sx={{ color: "#fff" }} />}
                  label={quiz.optionB}
                  disabled={alreadySubmitted}
                />
                <FormControlLabel
                  value="C"
                  control={<Radio sx={{ color: "#fff" }} />}
                  label={quiz.optionC}
                  disabled={alreadySubmitted}
                />
                <FormControlLabel
                  value="D"
                  control={<Radio sx={{ color: "#fff" }} />}
                  label={quiz.optionD}
                  disabled={alreadySubmitted}
                />
              </RadioGroup>
            </FormControl>

            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              disabled={!answer || alreadySubmitted}
              sx={{
                mt: 3,
                backgroundColor: alreadySubmitted ? "#ccc" : "#ffffff",
                color: "#09203F",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: alreadySubmitted ? "#ccc" : "#f0f0f0",
                },
              }}
            >
              {alreadySubmitted ? "Already Submitted" : "Submit"}
            </Button>
          </CardContent>
        </Card>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={toastOpen}
          autoHideDuration={3000}
          onClose={() => setToastOpen(false)}
        >
          <Alert
            onClose={() => setToastOpen(false)}
            severity="success" // success | error | warning | info
            sx={{ width: "100%" }}
          >
            {uploadMessages}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}
