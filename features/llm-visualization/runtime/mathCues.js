export const MATH_CUES = {
  intro_tokens: String.raw`
\texttt{<develo>}
`,

  intro_indices: String.raw`
\texttt{<develo>}
\longrightarrow
\mathbf{x}_0
`,

  intro_embedding: String.raw`x_t
=
E_{\mathrm{tok}}[i_t]
+
E_{\mathrm{pos}}[t]`,

  intro_flow: String.raw`x_t
\rightarrow
\operatorname{Transformer}
\rightarrow
p_{t+1}`,

  embedding_token: String.raw`e_t
=
E_{\mathrm{tok}}[i_t]
\in
\mathbb{R}^{48}`,

  embedding_position: String.raw`p_t
=
E_{\mathrm{pos}}[t]
\in
\mathbb{R}^{48}`,

  embedding_sum: String.raw`x_t=e_t+p_t`,

  layernorm_mean: String.raw`\mu_t
=
\frac{1}{C}
\sum_{c=1}^{C}
x_{t,c}`,

  layernorm_variance: String.raw`\sigma_t^2
=
\frac{1}{C}
\sum_{c=1}^{C}
(x_{t,c}-\mu_t)^2`,

  layernorm_normalize: String.raw`\hat{x}_{t,c}
=
\frac{x_{t,c}-\mu_t}
{\sqrt{\sigma_t^2+\varepsilon}},
\qquad
\varepsilon=10^{-5}`,

  layernorm_affine: String.raw`y_{t,c}
=
\gamma_c\hat{x}_{t,c}
+
\beta_c`,

  attention_qkv: String.raw`\begin{aligned}
q_t&=W_Qx_t+b_Q\\
k_t&=W_Kx_t+b_K\\
v_t&=W_Vx_t+b_V
\end{aligned}`,

  attention_dot: String.raw`d_{t,j}
=
q_t^\top k_j
=
\sum_{c=1}^{A}
q_{t,c}k_{j,c}`,

  attention_score: String.raw`s_{t,j}
=
\frac{q_t^\top k_j}
{\sqrt{A}},
\qquad
A=16`,

  attention_mask: String.raw`\tilde{s}_{t,j}
=
\begin{cases}
s_{t,j}, & j\le t\\
-\infty, & j>t
\end{cases}`,

  attention_softmax: String.raw`\begin{aligned}
m_t
&=
\max_{j\le t}
\tilde{s}_{t,j}\\[2pt]
\alpha_{t,j}
&=
\frac{
e^{\tilde{s}_{t,j}-m_t}
}{
\sum_{k=0}^{t}
e^{\tilde{s}_{t,k}-m_t}
}
\end{aligned}`,

  attention_weighted_value: String.raw`z_t
=
\sum_{j=0}^{t}
\alpha_{t,j}v_j`,

  projection_concat: String.raw`h_t
=
\operatorname{Concat}
\left(
z_t^{(1)},
z_t^{(2)},
z_t^{(3)}
\right)
\in
\mathbb{R}^{48}`,

  projection_linear: String.raw`o_t
=
W_Oh_t+b_O`,

  projection_residual: String.raw`r_t
=
x_t+o_t`,

  mlp_norm: String.raw`u_t
=
\operatorname{LN}(r_t)`,

  mlp_expand: String.raw`a_t
=
W_1u_t+b_1
\in
\mathbb{R}^{192}`,

  mlp_gelu: String.raw`\operatorname{GELU}(x)
\approx
\frac{x}{2}
\left[
1+
\tanh
\left(
\sqrt{\frac{2}{\pi}}
\left(
x+0.044715x^3
\right)
\right)
\right]`,

  mlp_project: String.raw`m_t
=
W_2
\operatorname{GELU}(a_t)
+b_2
\in
\mathbb{R}^{48}`,

  mlp_residual: String.raw`x'_t
=
r_t+m_t`,

  transformer_block: String.raw`\begin{aligned}
u^{(\ell)}
&=
x^{(\ell)}
+
\operatorname{Attn}
\left(
\operatorname{LN}_1
(x^{(\ell)})
\right)\\[4pt]
x^{(\ell+1)}
&=
u^{(\ell)}
+
\operatorname{MLP}
\left(
\operatorname{LN}_2
(u^{(\ell)})
\right)
\end{aligned}`,

  softmax_max: String.raw`
m=\max_j z_j
`,

  softmax_exp_sum: String.raw`
S=
\sum_j
e^{z_j-m}
`,

  softmax_stable: String.raw`
\operatorname{softmax}(z)_i
=
\frac{
e^{z_i-m}
}{
\sum_j e^{z_j-m}
}
`,

  output_final_norm: String.raw`h_t
=
\operatorname{LN}_f
\left(
x_t^{(3)}
\right)`,

  output_logits: String.raw`\ell_t
=
W_{\mathrm{vocab}}h_t`,

  output_probabilities: String.raw`p_t
=
\operatorname{softmax}
(\ell_t)`,

  output_argmax: String.raw`\hat y_{t+1}
=
\operatorname*{arg\,max}_{i\in\{A,B,C\}}
p_{t,i}`,

  idle: String.raw`x_t
\rightarrow
\operatorname{Transformer}
\rightarrow
p_{t+1}`,
};
