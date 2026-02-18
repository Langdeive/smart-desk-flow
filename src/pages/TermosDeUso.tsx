import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const TermosDeUso = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </Link>

        <h1 className="text-3xl font-bold mb-2">Termos de Uso</h1>
        <p className="text-muted-foreground mb-8">Última atualização: 18 de fevereiro de 2026</p>

        <div className="prose prose-gray max-w-none space-y-6 text-foreground/90">
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e utilizar o site e os serviços da <strong>SolveFlow</strong> ("nós", "nosso" ou "empresa"), você declara que leu, compreendeu e concorda em cumprir estes Termos de Uso. Caso não concorde com qualquer disposição, não utilize nossos Serviços.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. Descrição dos Serviços</h2>
            <p>A SolveFlow oferece soluções de automação com inteligência artificial, incluindo:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Consultoria em automação e IA para empresas</li>
              <li>Desenvolvimento de agentes inteligentes para atendimento e suporte</li>
              <li>Ferramentas de diagnóstico e calculadoras de ROI</li>
              <li>Integração com plataformas de comunicação (WhatsApp, e-mail)</li>
              <li>Sistemas de suporte e gestão de tickets</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. Cadastro e Conta</h2>
            <p>Para utilizar determinados Serviços, pode ser necessário criar uma conta. Você se compromete a:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Fornecer informações verdadeiras, completas e atualizadas</li>
              <li>Manter a confidencialidade de suas credenciais de acesso</li>
              <li>Notificar-nos imediatamente sobre qualquer uso não autorizado da sua conta</li>
              <li>Ser responsável por todas as atividades realizadas em sua conta</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. Uso Permitido</h2>
            <p>Ao utilizar nossos Serviços, você concorda em:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Utilizar os Serviços apenas para fins lícitos e conforme estes Termos</li>
              <li>Não reproduzir, distribuir ou modificar nosso conteúdo sem autorização</li>
              <li>Não tentar acessar áreas restritas do sistema sem permissão</li>
              <li>Não utilizar os Serviços para enviar spam, malware ou conteúdo malicioso</li>
              <li>Não realizar engenharia reversa ou tentativas de descompilar nossos softwares</li>
              <li>Respeitar os direitos de propriedade intelectual da SolveFlow e de terceiros</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo disponível nos Serviços, incluindo textos, gráficos, logotipos, ícones, imagens, clipes de áudio, downloads digitais, compilações de dados e software, é propriedade da SolveFlow ou de seus licenciantes e é protegido pelas leis brasileiras e internacionais de propriedade intelectual.
            </p>
            <p>
              A marca "SolveFlow", seu logotipo e demais marcas exibidas nos Serviços são de propriedade da SolveFlow. Nenhuma disposição nestes Termos concede a você qualquer direito de uso dessas marcas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Pagamentos e Planos</h2>
            <p>
              Alguns Serviços podem ser oferecidos mediante pagamento. As condições de preço, forma de pagamento, prazo e renovação serão informadas no momento da contratação. Ao contratar um plano pago, você concorda com:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Realizar o pagamento na forma e prazo acordados</li>
              <li>A renovação automática do plano, salvo cancelamento prévio</li>
              <li>A política de reembolso aplicável, conforme descrito na contratação</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. Limitação de Responsabilidade</h2>
            <p>
              Os Serviços são fornecidos "como estão" e "conforme disponíveis". A SolveFlow não garante que os Serviços serão ininterruptos, livres de erros ou seguros. Na máxima extensão permitida por lei:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Não nos responsabilizamos por danos indiretos, incidentais, especiais ou consequenciais</li>
              <li>Nossa responsabilidade total está limitada ao valor pago por você nos últimos 12 meses</li>
              <li>Não garantimos resultados específicos decorrentes do uso dos Serviços</li>
              <li>Ferramentas de diagnóstico e calculadoras fornecem estimativas e não constituem garantia de resultados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">8. Isenção de Garantias</h2>
            <p>
              A SolveFlow se exime de todas as garantias, expressas ou implícitas, incluindo, sem limitação, garantias de comercialização, adequação a uma finalidade específica e não violação. Não garantimos que:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Os Serviços atenderão todos os seus requisitos</li>
              <li>Os resultados obtidos serão precisos ou confiáveis</li>
              <li>Quaisquer erros serão corrigidos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">9. Indenização</h2>
            <p>
              Você concorda em indenizar e isentar a SolveFlow, seus diretores, funcionários e parceiros de quaisquer reivindicações, danos, perdas, custos e despesas (incluindo honorários advocatícios) decorrentes de:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Seu uso dos Serviços</li>
              <li>Violação destes Termos</li>
              <li>Violação de direitos de terceiros</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">10. Privacidade</h2>
            <p>
              O tratamento dos seus dados pessoais é regido pela nossa <Link to="/politica-de-privacidade" className="text-primary hover:underline">Política de Privacidade</Link>, que é parte integrante destes Termos de Uso. Ao utilizar nossos Serviços, você também concorda com os termos da nossa Política de Privacidade.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">11. Modificações dos Termos</h2>
            <p>
              Reservamo-nos o direito de modificar estes Termos a qualquer momento. As alterações entram em vigor imediatamente após a publicação no site. O uso continuado dos Serviços após a publicação de alterações constitui sua aceitação dos novos Termos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">12. Rescisão</h2>
            <p>
              Podemos suspender ou encerrar seu acesso aos Serviços, a nosso exclusivo critério, sem aviso prévio, caso:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Você viole estes Termos de Uso</li>
              <li>Seu uso dos Serviços represente risco à segurança ou integridade do sistema</li>
              <li>Seja exigido por lei ou ordem judicial</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">13. Legislação Aplicável e Foro</h2>
            <p>
              Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca de Jaraguá do Sul/SC para dirimir quaisquer controvérsias decorrentes destes Termos, com renúncia a qualquer outro, por mais privilegiado que seja.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">14. Disposições Gerais</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Se qualquer disposição destes Termos for considerada inválida, as demais permanecerão em pleno vigor</li>
              <li>A falha em exercer qualquer direito não constitui renúncia ao mesmo</li>
              <li>Estes Termos constituem o acordo integral entre você e a SolveFlow</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">15. Contato</h2>
            <p>Para dúvidas sobre estes Termos de Uso, entre em contato:</p>
            <ul className="list-none space-y-1">
              <li><strong>SolveFlow</strong></li>
              <li>E-mail: contato@solveflow.com.br</li>
              <li>Endereço: Jaraguá do Sul/SC, Brasil</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermosDeUso;
