import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PoliticaPrivacidade = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </Link>

        <h1 className="text-3xl font-bold mb-2">Política de Privacidade</h1>
        <p className="text-muted-foreground mb-8">Última atualização: 18 de fevereiro de 2026</p>

        <div className="prose prose-gray max-w-none space-y-6 text-foreground/90">
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Introdução</h2>
            <p>
              A <strong>SolveFlow</strong> ("nós", "nosso" ou "empresa"), inscrita no CNPJ sob o nº 62.108.514/0001-12, com sede em Jaraguá do Sul/SC, Brasil, é responsável pelo tratamento dos seus dados pessoais. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos, compartilhamos e protegemos suas informações pessoais quando você utiliza nosso site, aplicativos e serviços ("Serviços").
            </p>
            <p>
              Ao acessar ou utilizar nossos Serviços, você concorda com as práticas descritas nesta Política. Caso não concorde, por favor, não utilize nossos Serviços.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. Dados que Coletamos</h2>
            <p>Podemos coletar as seguintes categorias de dados pessoais:</p>
            <h3 className="text-lg font-medium text-foreground">2.1. Dados fornecidos por você</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Nome completo</li>
              <li>Endereço de e-mail</li>
              <li>Número de telefone/WhatsApp</li>
              <li>Nome da empresa</li>
              <li>Cargo ou função</li>
              <li>Informações inseridas em formulários, diagnósticos ou interações com nossos serviços</li>
            </ul>
            <h3 className="text-lg font-medium text-foreground">2.2. Dados coletados automaticamente</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Endereço IP</li>
              <li>Tipo de navegador e dispositivo</li>
              <li>Páginas visitadas e tempo de permanência</li>
              <li>Dados de cookies e tecnologias similares</li>
              <li>Dados de geolocalização aproximada</li>
            </ul>
            <h3 className="text-lg font-medium text-foreground">2.3. Dados de terceiros</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Informações obtidas de plataformas de redes sociais (como Meta/Facebook) quando você interage com nossos anúncios ou páginas</li>
              <li>Dados de parceiros comerciais e plataformas de marketing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. Finalidades do Tratamento</h2>
            <p>Utilizamos seus dados pessoais para as seguintes finalidades:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Prestar e melhorar nossos Serviços</li>
              <li>Processar solicitações, cadastros e diagnósticos</li>
              <li>Enviar comunicações de marketing, newsletters e atualizações (com seu consentimento)</li>
              <li>Personalizar sua experiência em nosso site</li>
              <li>Realizar análises estatísticas e de desempenho</li>
              <li>Cumprir obrigações legais e regulatórias</li>
              <li>Prevenir fraudes e garantir a segurança dos Serviços</li>
              <li>Veicular anúncios personalizados em plataformas de terceiros (como Meta Ads)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. Base Legal para o Tratamento</h2>
            <p>O tratamento dos seus dados é fundamentado nas seguintes bases legais, conforme a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018):</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Consentimento:</strong> quando você fornece seus dados voluntariamente</li>
              <li><strong>Execução de contrato:</strong> quando necessário para prestar os Serviços contratados</li>
              <li><strong>Legítimo interesse:</strong> para melhorar nossos Serviços e realizar marketing direto</li>
              <li><strong>Cumprimento de obrigação legal:</strong> quando exigido por lei</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Compartilhamento de Dados</h2>
            <p>Podemos compartilhar seus dados pessoais com:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Prestadores de serviços:</strong> empresas que nos auxiliam na operação (hospedagem, e-mail marketing, analytics)</li>
              <li><strong>Plataformas de publicidade:</strong> como Meta (Facebook/Instagram), Google Ads, para fins de remarketing e publicidade personalizada</li>
              <li><strong>Parceiros comerciais:</strong> quando necessário para a prestação dos Serviços</li>
              <li><strong>Autoridades públicas:</strong> quando exigido por lei ou ordem judicial</li>
            </ul>
            <p>Não vendemos seus dados pessoais a terceiros.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Cookies e Tecnologias de Rastreamento</h2>
            <p>Utilizamos cookies e tecnologias similares para:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Garantir o funcionamento adequado do site</li>
              <li>Analisar o tráfego e uso dos Serviços</li>
              <li>Personalizar conteúdo e anúncios</li>
              <li>Medir a eficácia de campanhas publicitárias</li>
            </ul>
            <p>Você pode gerenciar suas preferências de cookies através das configurações do seu navegador. Note que desabilitar cookies pode afetar a funcionalidade do site.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. Retenção de Dados</h2>
            <p>
              Seus dados pessoais serão armazenados pelo tempo necessário para cumprir as finalidades descritas nesta Política, ou conforme exigido por lei. Dados de marketing são mantidos até que você solicite a exclusão ou revogue o consentimento.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">8. Seus Direitos</h2>
            <p>Conforme a LGPD, você tem direito a:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Confirmar a existência de tratamento de dados</li>
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou desatualizados</li>
              <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários</li>
              <li>Solicitar a portabilidade dos dados</li>
              <li>Revogar o consentimento a qualquer momento</li>
              <li>Solicitar a eliminação dos dados tratados com base no consentimento</li>
            </ul>
            <p>Para exercer seus direitos, entre em contato conosco pelo e-mail: <strong>privacidade@solveflow.com.br</strong></p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">9. Segurança dos Dados</h2>
            <p>
              Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais contra acesso não autorizado, destruição, perda, alteração ou qualquer forma de tratamento inadequado, incluindo criptografia, controle de acesso e monitoramento contínuo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">10. Transferência Internacional de Dados</h2>
            <p>
              Seus dados podem ser transferidos para servidores localizados fora do Brasil (como servidores de hospedagem e serviços em nuvem). Nesses casos, garantimos que os dados recebem nível de proteção adequado conforme a legislação aplicável.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">11. Menores de Idade</h2>
            <p>
              Nossos Serviços não são destinados a menores de 18 anos. Não coletamos intencionalmente dados de menores. Caso tome conhecimento de que dados de um menor foram coletados, entre em contato conosco para providenciarmos a exclusão.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">12. Alterações nesta Política</h2>
            <p>
              Podemos atualizar esta Política periodicamente. A versão mais recente estará sempre disponível em nosso site com a data da última atualização. Recomendamos que você revise esta Política regularmente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">13. Contato</h2>
            <p>Para dúvidas, solicitações ou reclamações sobre esta Política de Privacidade ou o tratamento de seus dados pessoais, entre em contato:</p>
            <ul className="list-none space-y-1">
              <li><strong>SolveFlow</strong></li>
              <li>E-mail: privacidade@solveflow.com.br</li>
              <li>Endereço: Jaraguá do Sul/SC, Brasil</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PoliticaPrivacidade;
